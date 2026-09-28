import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const root=process.cwd();
const android=join(root,'android');
const app=join(android,'app');
const pkgDir=join(app,'src','main','java','com','tokhirjonyuldoshev','bpdiary');
await mkdir(pkgDir,{recursive:true});

// Permanent signing key: decode once from the tracked base64 source and wire Gradle explicitly.
// Previous builds relied on the runner's default debug signing behavior, which produced incompatible APKs.
const keyB64=(await readFile(join(root,'ci','debug.keystore.b64'),'utf8')).trim();
await writeFile(join(app,'bp-diary-signing.p12'),Buffer.from(keyB64,'base64'));

let gradle=await readFile(join(app,'build.gradle'),'utf8');
if(!gradle.includes('bpDiaryStable')){
  gradle=gradle.replace(/android\s*\{/,m=>m+`
    signingConfigs {
        bpDiaryStable {
            storeFile file("bp-diary-signing.p12")
            storePassword "android"
            keyAlias "androiddebugkey"
            keyPassword "android"
            storeType "PKCS12"
        }
    }
`);
  gradle=gradle.replace(/buildTypes\s*\{/,m=>m+`
        debug {
            signingConfig signingConfigs.bpDiaryStable
        }
`);
}
await writeFile(join(app,'build.gradle'),gradle,'utf8');

const mainActivity=`package com.tokhirjonyuldoshev.bpdiary;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NativeBridgePlugin.class);
        super.onCreate(savedInstanceState);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        try {
            if (getBridge() != null && getBridge().getWebView() != null) {
                getBridge().getWebView().evaluateJavascript(
                    "window.__bpHandleAndroidBack ? window.__bpHandleAndroidBack() : true;",
                    null
                );
                return;
            }
        } catch (Exception ignored) {
        }
        super.onBackPressed();
    }
}
`;
await writeFile(join(pkgDir,'MainActivity.java'),mainActivity,'utf8');

const plugin=`package com.tokhirjonyuldoshev.bpdiary;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.provider.DocumentsContract;
import android.provider.OpenableColumns;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintDocumentInfo;
import android.print.PrintManager;
import android.speech.RecognizerIntent;
import android.speech.tts.TextToSpeech;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.activity.result.ActivityResult;
import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Locale;

@CapacitorPlugin(name = "NativeBridge")
public class NativeBridgePlugin extends Plugin {
    private TextToSpeech tts;
    private WebView printWebView;
    private WebView shareWebView;

    @PluginMethod
    public void recognizeSpeech(PluginCall call) {
        try {
            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            String lang = call.getString("lang");
            if (lang == null || lang.isEmpty()) lang = "ru-RU";
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang);
            intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3);
            intent.putExtra(RecognizerIntent.EXTRA_PROMPT, call.getString("prompt"));
            startActivityForResult(call, intent, "speechResult");
        } catch (Exception e) {
            call.reject("Speech recognition is unavailable", e);
        }
    }

    @ActivityCallback
    private void speechResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null) {
            call.reject("Speech recognition cancelled");
            return;
        }
        ArrayList<String> matches = result.getData().getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
        if (matches == null || matches.isEmpty()) {
            call.reject("No speech result");
            return;
        }
        JSObject out = new JSObject();
        out.put("text", matches.get(0));
        call.resolve(out);
    }

    @PluginMethod
    public void speak(PluginCall call) {
        final String text = call.getString("text");
        String lang = call.getString("lang");
        if (text == null || text.trim().isEmpty()) {
            call.reject("No text to speak");
            return;
        }
        final Locale locale = Locale.forLanguageTag(lang == null ? "ru-RU" : lang);
        getActivity().runOnUiThread(() -> {
            if (tts != null) {
                tts.setLanguage(locale);
                tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "bp-diary");
                call.resolve();
                return;
            }
            tts = new TextToSpeech(getContext(), status -> {
                if (status != TextToSpeech.SUCCESS) {
                    call.reject("Text-to-speech initialization failed");
                    return;
                }
                tts.setLanguage(locale);
                tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "bp-diary");
                call.resolve();
            });
        });
    }

    @PluginMethod
    public void shareText(PluginCall call) {
        try {
            String text = call.getString("text");
            String subject = call.getString("subject");
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType("text/plain");
            send.putExtra(Intent.EXTRA_TEXT, text == null ? "" : text);
            if (subject != null && !subject.isEmpty()) send.putExtra(Intent.EXTRA_SUBJECT, subject);
            Intent chooser = Intent.createChooser(send, call.getString("title"));
            getActivity().startActivity(chooser);
            call.resolve();
        } catch (Exception e) {
            call.reject("Share failed", e);
        }
    }

    @PluginMethod
    public void saveTextFile(PluginCall call) {
        try {
            Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            String mime = call.getString("mime");
            intent.setType(mime == null ? "application/json" : mime);
            String fileName = call.getString("fileName");
            if (fileName != null && !fileName.isEmpty()) intent.putExtra(Intent.EXTRA_TITLE, fileName);
            startActivityForResult(call, intent, "saveTextResult");
        } catch (Exception e) {
            call.reject("Could not open save dialog", e);
        }
    }

    @ActivityCallback
    private void saveTextResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.reject("Save cancelled");
            return;
        }
        Uri uri = result.getData().getData();
        String content = call.getString("content");
        if (content == null) content = "";
        try (OutputStream os = getContext().getContentResolver().openOutputStream(uri, "w")) {
            if (os == null) throw new IllegalStateException("No output stream");
            os.write(content.getBytes(StandardCharsets.UTF_8));
            os.flush();
            JSObject out = new JSObject();
            out.put("uri", uri.toString());
            out.put("name", displayName(uri));
            call.resolve(out);
        } catch (Exception e) {
            call.reject("Could not save file", e);
        }
    }

    @PluginMethod
    public void openTextFile(PluginCall call) {
        try {
            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            String mime = call.getString("mime");
            intent.setType(mime == null ? "application/json" : mime);
            String initialUri = call.getString("initialUri");
            if (initialUri != null && !initialUri.isEmpty() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, Uri.parse(initialUri));
            }
            startActivityForResult(call, intent, "openTextResult");
        } catch (Exception e) {
            call.reject("Could not open file picker", e);
        }
    }

    @ActivityCallback
    private void openTextResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.reject("Open cancelled");
            return;
        }
        Uri uri = result.getData().getData();
        try (InputStream is = getContext().getContentResolver().openInputStream(uri);
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            if (is == null) throw new IllegalStateException("No input stream");
            byte[] buf = new byte[8192];
            int n;
            int total = 0;
            while ((n = is.read(buf)) != -1) {
                total += n;
                if (total > 12 * 1024 * 1024) throw new IllegalStateException("Backup file is too large");
                bos.write(buf, 0, n);
            }
            JSObject out = new JSObject();
            out.put("content", bos.toString(StandardCharsets.UTF_8.name()));
            out.put("uri", uri.toString());
            out.put("name", displayName(uri));
            call.resolve(out);
        } catch (Exception e) {
            call.reject("Could not read file", e);
        }
    }

    @PluginMethod
    public void printHtml(PluginCall call) {
        final String html = call.getString("html");
        final String orientation = call.getString("orientation");
        final String jobName = call.getString("jobName") == null ? "BP Diary report" : call.getString("jobName");
        if (html == null || html.isEmpty()) {
            call.reject("No report HTML");
            return;
        }
        getActivity().runOnUiThread(() -> {
            try {
                printWebView = new WebView(getContext());
                printWebView.getSettings().setJavaScriptEnabled(false);
                printWebView.setWebViewClient(new WebViewClient() {
                    @Override
                    public void onPageFinished(WebView view, String url) {
                        try {
                            PrintManager pm = (PrintManager) getContext().getSystemService(Context.PRINT_SERVICE);
                            PrintAttributes.MediaSize media = PrintAttributes.MediaSize.ISO_A4;
                            if ("landscape".equalsIgnoreCase(orientation)) media = media.asLandscape();
                            else media = media.asPortrait();
                            PrintAttributes attrs = new PrintAttributes.Builder()
                                .setMediaSize(media)
                                .setColorMode(PrintAttributes.COLOR_MODE_COLOR)
                                .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
                                .build();
                            pm.print(jobName, view.createPrintDocumentAdapter(jobName), attrs);
                            call.resolve();
                        } catch (Exception e) {
                            call.reject("Could not open PDF print dialog", e);
                        }
                    }
                });
                printWebView.loadDataWithBaseURL("https://localhost/", html, "text/html", "UTF-8", null);
            } catch (Exception e) {
                call.reject("Could not prepare PDF", e);
            }
        });
    }

    @PluginMethod
    public void sharePdf(PluginCall call) {
        final String html = call.getString("html");
        final String requestedName = call.getString("fileName");
        final String chooserTitle = call.getString("title");
        if (html == null || html.isEmpty()) {
            call.reject("No report HTML");
            return;
        }
        getActivity().runOnUiThread(() -> {
            try {
                shareWebView = new WebView(getContext());
                shareWebView.getSettings().setJavaScriptEnabled(false);
                shareWebView.setWebViewClient(new WebViewClient() {
                    @Override
                    public void onPageFinished(WebView view, String url) {
                        try {
                            String fileName = requestedName == null || requestedName.trim().isEmpty()
                                ? "BP-Diary-Doctor-Report.pdf"
                                : requestedName.replaceAll("[^A-Za-z0-9._-]", "_");
                            if (!fileName.toLowerCase(Locale.ROOT).endsWith(".pdf")) fileName += ".pdf";
                            File dir = new File(getContext().getCacheDir(), "shared");
                            if (!dir.exists() && !dir.mkdirs()) throw new IllegalStateException("Could not create share directory");
                            File pdf = new File(dir, fileName);
                            if (pdf.exists() && !pdf.delete()) throw new IllegalStateException("Could not replace old report");

                            PrintAttributes attrs = new PrintAttributes.Builder()
                                .setMediaSize(PrintAttributes.MediaSize.ISO_A4.asPortrait())
                                .setColorMode(PrintAttributes.COLOR_MODE_COLOR)
                                .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
                                .build();
                            PrintDocumentAdapter adapter = view.createPrintDocumentAdapter("BP Diary report");
                            ParcelFileDescriptor pfd = ParcelFileDescriptor.open(
                                pdf,
                                ParcelFileDescriptor.MODE_CREATE | ParcelFileDescriptor.MODE_TRUNCATE | ParcelFileDescriptor.MODE_READ_WRITE
                            );
                            CancellationSignal signal = new CancellationSignal();

                            adapter.onLayout(attrs, attrs, signal, new PrintDocumentAdapter.LayoutResultCallback() {
                                @Override
                                public void onLayoutFinished(PrintDocumentInfo info, boolean changed) {
                                    adapter.onWrite(new PageRange[]{PageRange.ALL_PAGES}, pfd, signal, new PrintDocumentAdapter.WriteResultCallback() {
                                        @Override
                                        public void onWriteFinished(PageRange[] pages) {
                                            try {
                                                pfd.close();
                                                adapter.onFinish();
                                                Uri uri = FileProvider.getUriForFile(
                                                    getContext(),
                                                    getContext().getPackageName() + ".fileprovider",
                                                    pdf
                                                );
                                                Intent send = new Intent(Intent.ACTION_SEND);
                                                send.setType("application/pdf");
                                                send.putExtra(Intent.EXTRA_STREAM, uri);
                                                send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                                                getActivity().startActivity(Intent.createChooser(
                                                    send,
                                                    chooserTitle == null || chooserTitle.isEmpty() ? "Share doctor report" : chooserTitle
                                                ));
                                                call.resolve();
                                            } catch (Exception e) {
                                                call.reject("Could not share PDF", e);
                                            } finally {
                                                if (shareWebView != null) {
                                                    shareWebView.destroy();
                                                    shareWebView = null;
                                                }
                                            }
                                        }

                                        @Override
                                        public void onWriteFailed(CharSequence error) {
                                            try { pfd.close(); } catch (Exception ignored) {}
                                            adapter.onFinish();
                                            if (shareWebView != null) { shareWebView.destroy(); shareWebView = null; }
                                            call.reject("Could not create PDF: " + String.valueOf(error));
                                        }

                                        @Override
                                        public void onWriteCancelled() {
                                            try { pfd.close(); } catch (Exception ignored) {}
                                            adapter.onFinish();
                                            if (shareWebView != null) { shareWebView.destroy(); shareWebView = null; }
                                            call.reject("PDF creation cancelled");
                                        }
                                    });
                                }

                                @Override
                                public void onLayoutFailed(CharSequence error) {
                                    try { pfd.close(); } catch (Exception ignored) {}
                                    adapter.onFinish();
                                    if (shareWebView != null) { shareWebView.destroy(); shareWebView = null; }
                                    call.reject("Could not layout PDF: " + String.valueOf(error));
                                }

                                @Override
                                public void onLayoutCancelled() {
                                    try { pfd.close(); } catch (Exception ignored) {}
                                    adapter.onFinish();
                                    if (shareWebView != null) { shareWebView.destroy(); shareWebView = null; }
                                    call.reject("PDF layout cancelled");
                                }
                            }, new Bundle());
                        } catch (Exception e) {
                            if (shareWebView != null) { shareWebView.destroy(); shareWebView = null; }
                            call.reject("Could not prepare PDF share", e);
                        }
                    }
                });
                shareWebView.loadDataWithBaseURL("https://localhost/", html, "text/html", "UTF-8", null);
            } catch (Exception e) {
                call.reject("Could not prepare PDF share", e);
            }
        });
    }

    private String displayName(Uri uri) {
        Cursor cursor = null;
        try {
            cursor = getContext().getContentResolver().query(uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null);
            if (cursor != null && cursor.moveToFirst()) {
                int idx = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (idx >= 0) return cursor.getString(idx);
            }
        } catch (Exception ignored) {
        } finally {
            if (cursor != null) cursor.close();
        }
        String last = uri.getLastPathSegment();
        return last == null ? uri.toString() : last;
    }

    @Override
    protected void handleOnDestroy() {
        if (tts != null) {
            tts.stop();
            tts.shutdown();
            tts = null;
        }
        if (printWebView != null) {
            printWebView.destroy();
            printWebView = null;
        }
        if (shareWebView != null) {
            shareWebView.destroy();
            shareWebView = null;
        }
        super.handleOnDestroy();
    }
}
`;
await writeFile(join(pkgDir,'NativeBridgePlugin.java'),plugin,'utf8');

const resXml=join(app,'src','main','res','xml');
const resDrawable=join(app,'src','main','res','drawable');
await mkdir(resXml,{recursive:true});
await mkdir(resDrawable,{recursive:true});
await writeFile(join(resXml,'bp_diary_file_paths.xml'),`<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <cache-path name="shared_reports" path="shared/" />
</paths>
`,'utf8');
await writeFile(join(resDrawable,'bp_diary_icon.xml'),`<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path android:fillColor="#FFF8F8" android:pathData="M54,4a50,50 0,1 0,0.1 0z" />
    <path android:fillColor="#E53935" android:pathData="M54,92C49,87 20,68 20,40C20,22 42,17 54,32C66,17 88,22 88,40C88,68 59,87 54,92Z" />
    <path
        android:fillColor="@android:color/transparent"
        android:strokeColor="#FFFFFF"
        android:strokeWidth="5"
        android:strokeLineCap="round"
        android:strokeLineJoin="round"
        android:pathData="M29,54L40,54L46,42L55,66L62,49L69,54L80,54" />
</vector>
`,'utf8');

const manifestPath=join(app,'src','main','AndroidManifest.xml');
let manifest=await readFile(manifestPath,'utf8');
if(!manifest.includes('android.intent.action.TTS_SERVICE')){
  manifest=manifest.replace(/<application\b/,`<queries>
        <intent><action android:name="android.intent.action.TTS_SERVICE" /></intent>
        <intent><action android:name="android.speech.action.RECOGNIZE_SPEECH" /></intent>
    </queries>
    <application`);
}
manifest=manifest.replace(/android:icon="[^"]+"/,'android:icon="@drawable/bp_diary_icon"');
manifest=manifest.replace(/android:roundIcon="[^"]+"/,'android:roundIcon="@drawable/bp_diary_icon"');
if(!manifest.includes('.fileprovider')){
  manifest=manifest.replace('</application>',`        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/bp_diary_file_paths" />
        </provider>
    </application>`);
}
await writeFile(manifestPath,manifest,'utf8');

console.log('Patched Android native bridge and permanent signing configuration.');
