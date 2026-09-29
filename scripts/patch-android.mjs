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
if(!/release\s*\{[\s\S]*?signingConfig\s+signingConfigs\.bpDiaryStable/.test(gradle)){
  gradle=gradle.replace(/release\s*\{/,m=>m+`
            signingConfig signingConfigs.bpDiaryStable
`);
}
await writeFile(join(app,'build.gradle'),gradle,'utf8');

const mainActivity=`package com.tokhirjonyuldoshev.bpdiary;

import android.os.Bundle;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NativeBridgePlugin.class);
        super.onCreate(savedInstanceState);

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                try {
                    if (getBridge() != null && getBridge().getWebView() != null) {
                        getBridge().getWebView().evaluateJavascript(
                            "window.__bpHandleAndroidBack ? window.__bpHandleAndroidBack() : 'exit';",
                            value -> {
                                if (value != null && value.contains("exit")) {
                                    setEnabled(false);
                                    getOnBackPressedDispatcher().onBackPressed();
                                    setEnabled(true);
                                }
                            }
                        );
                        return;
                    }
                } catch (Exception ignored) {
                }
                setEnabled(false);
                getOnBackPressedDispatcher().onBackPressed();
                setEnabled(true);
            }
        });
    }
}
`;
await writeFile(join(pkgDir,'MainActivity.java'),mainActivity,'utf8');

const reminderScheduler=`package com.tokhirjonyuldoshev.bpdiary;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

import java.util.Calendar;

public final class ReminderScheduler {
    public static final String ACTION_REMINDER = "com.tokhirjonyuldoshev.bpdiary.ACTION_DAILY_REMINDER";
    private static final String PREFS = "bp_diary_native_reminder";
    private static final String KEY_ENABLED = "enabled";
    private static final String KEY_TIME = "time";
    private static final String KEY_TITLE = "title";
    private static final String KEY_BODY = "body";
    private static final int REQUEST_CODE = 16001;

    private ReminderScheduler() {}

    public static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    public static boolean isEnabled(Context context) {
        return prefs(context).getBoolean(KEY_ENABLED, false);
    }

    public static String getTime(Context context) {
        return prefs(context).getString(KEY_TIME, "09:00");
    }

    public static String getTitle(Context context) {
        return prefs(context).getString(KEY_TITLE, "BP Diary");
    }

    public static String getBody(Context context) {
        return prefs(context).getString(KEY_BODY, "Time to measure your blood pressure");
    }

    public static long nextTriggerMillis(String time) {
        if (time == null || !time.matches("^(?:[01]\\d|2[0-3]):[0-5]\\d$")) {
            throw new IllegalArgumentException("Invalid reminder time");
        }
        String[] parts = time.split(":");
        int hour = Integer.parseInt(parts[0]);
        int minute = Integer.parseInt(parts[1]);
        Calendar now = Calendar.getInstance();
        Calendar next = Calendar.getInstance();
        next.set(Calendar.HOUR_OF_DAY, hour);
        next.set(Calendar.MINUTE, minute);
        next.set(Calendar.SECOND, 0);
        next.set(Calendar.MILLISECOND, 0);
        if (!next.after(now)) next.add(Calendar.DAY_OF_YEAR, 1);
        return next.getTimeInMillis();
    }

    private static PendingIntent alarmIntent(Context context) {
        Intent intent = new Intent(context, ReminderReceiver.class).setAction(ACTION_REMINDER);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;
        return PendingIntent.getBroadcast(context, REQUEST_CODE, intent, flags);
    }

    public static void schedule(Context context, String time, String title, String body) {
        prefs(context).edit()
            .putBoolean(KEY_ENABLED, true)
            .putString(KEY_TIME, time)
            .putString(KEY_TITLE, title == null || title.trim().isEmpty() ? "BP Diary" : title.trim())
            .putString(KEY_BODY, body == null || body.trim().isEmpty() ? "Time to measure your blood pressure" : body.trim())
            .apply();
        scheduleNext(context);
    }

    public static void scheduleNext(Context context) {
        if (!isEnabled(context)) return;
        AlarmManager alarms = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarms == null) return;
        long when = nextTriggerMillis(getTime(context));
        PendingIntent pi = alarmIntent(context);
        alarms.cancel(pi);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarms.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, when, pi);
        } else {
            alarms.set(AlarmManager.RTC_WAKEUP, when, pi);
        }
    }

    public static void cancel(Context context) {
        prefs(context).edit().putBoolean(KEY_ENABLED, false).apply();
        AlarmManager alarms = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarms != null) alarms.cancel(alarmIntent(context));
    }
}
`;
await writeFile(join(pkgDir,'ReminderScheduler.java'),reminderScheduler,'utf8');

const reminderReceiver=`package com.tokhirjonyuldoshev.bpdiary;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

public class ReminderReceiver extends BroadcastReceiver {
    private static final String CHANNEL_ID = "bp_diary_reminders";
    private static final int NOTIFICATION_ID = 16001;

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent == null ? null : intent.getAction();
        if (Intent.ACTION_BOOT_COMPLETED.equals(action)
            || Intent.ACTION_TIME_CHANGED.equals(action)
            || Intent.ACTION_TIMEZONE_CHANGED.equals(action)) {
            ReminderScheduler.scheduleNext(context);
            return;
        }
        if (!ReminderScheduler.ACTION_REMINDER.equals(action) || !ReminderScheduler.isEnabled(context)) return;
        showNotification(context);
        ReminderScheduler.scheduleNext(context);
    }

    private void showNotification(Context context) {
        createChannel(context);
        Intent launch = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        PendingIntent contentIntent = null;
        if (launch != null) {
            launch.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;
            contentIntent = PendingIntent.getActivity(context, 16002, launch, flags);
        }
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.bp_diary_notification)
            .setContentTitle(ReminderScheduler.getTitle(context))
            .setContentText(ReminderScheduler.getBody(context))
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setAutoCancel(true)
            .setVisibility(NotificationCompat.VISIBILITY_PRIVATE);
        if (contentIntent != null) builder.setContentIntent(contentIntent);
        try {
            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, builder.build());
        } catch (SecurityException ignored) {
        }
    }

    private void createChannel(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null) return;
        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            "BP Diary reminders",
            NotificationManager.IMPORTANCE_DEFAULT
        );
        channel.setDescription("Daily blood pressure measurement reminders");
        manager.createNotificationChannel(channel);
    }
}
`;
await writeFile(join(pkgDir,'ReminderReceiver.java'),reminderReceiver,'utf8');

const plugin=`package com.tokhirjonyuldoshev.bpdiary;

import android.Manifest;
import android.app.Activity;
import android.app.NotificationManager;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.DocumentsContract;
import android.provider.OpenableColumns;
import android.provider.Settings;
import android.util.Base64;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.speech.RecognizerIntent;
import android.speech.tts.TextToSpeech;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.activity.result.ActivityResult;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Locale;

import org.json.JSONArray;
import org.json.JSONObject;

@CapacitorPlugin(name = "NativeBridge")
public class NativeBridgePlugin extends Plugin {
    private TextToSpeech tts;
    private WebView printWebView;

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
    public void sharePdfBase64(PluginCall call) {
        final String base64 = call.getString("base64");
        final String requestedName = call.getString("fileName");
        final String chooserTitle = call.getString("title");
        if (base64 == null || base64.trim().isEmpty()) {
            call.reject("No PDF data");
            return;
        }
        try {
            byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
            if (bytes.length < 5 || bytes[0] != '%' || bytes[1] != 'P' || bytes[2] != 'D' || bytes[3] != 'F' || bytes[4] != '-') {
                call.reject("Invalid PDF data");
                return;
            }
            String fileName = requestedName == null || requestedName.trim().isEmpty()
                ? "BP-Diary-Doctor-Report.pdf"
                : requestedName.replaceAll("[^A-Za-z0-9._-]", "_");
            if (!fileName.toLowerCase(Locale.ROOT).endsWith(".pdf")) fileName += ".pdf";

            File dir = new File(getContext().getCacheDir(), "shared");
            if (!dir.exists() && !dir.mkdirs()) throw new IllegalStateException("Could not create share directory");
            File pdf = new File(dir, fileName);
            try (FileOutputStream out = new FileOutputStream(pdf, false)) {
                out.write(bytes);
                out.flush();
            }

            Uri uri = FileProvider.getUriForFile(
                getContext(),
                getContext().getPackageName() + ".fileprovider",
                pdf
            );
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType("application/pdf");
            send.putExtra(Intent.EXTRA_STREAM, uri);
            send.setClipData(ClipData.newRawUri("BP Diary doctor report", uri));
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            getActivity().startActivity(Intent.createChooser(
                send,
                chooserTitle == null || chooserTitle.isEmpty() ? "Share doctor report" : chooserTitle
            ));
            JSObject result = new JSObject();
            result.put("name", fileName);
            result.put("bytes", bytes.length);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Could not share PDF", e);
        }
    }

    private File autoBackupDir() {
        File dir = new File(getContext().getFilesDir(), "auto-backups");
        if (!dir.exists()) dir.mkdirs();
        return dir;
    }

    private void pruneAutoBackups() {
        try {
            File[] files = autoBackupDir().listFiles((dir, name) -> name != null && name.endsWith(".json"));
            if (files == null || files.length <= 5) return;
            Arrays.sort(files, (a, b) -> Long.compare(b.lastModified(), a.lastModified()));
            for (int i = 5; i < files.length; i++) files[i].delete();
        } catch (Exception ignored) {
        }
    }

    @PluginMethod
    public void saveAutoBackup(PluginCall call) {
        String content = call.getString("content");
        String reason = call.getString("reason");
        if (content == null || content.trim().isEmpty()) {
            call.reject("No backup content");
            return;
        }
        try {
            byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
            if (bytes.length > 12 * 1024 * 1024) {
                call.reject("Backup is too large");
                return;
            }
            String safeReason = reason == null ? "auto" : reason.replaceAll("[^A-Za-z0-9_-]", "-");
            if (safeReason.isEmpty()) safeReason = "auto";
            long ts = System.currentTimeMillis();
            File outFile = new File(autoBackupDir(), "backup-" + ts + "-" + safeReason + ".json");
            try (FileOutputStream out = new FileOutputStream(outFile, false)) {
                out.write(bytes);
                out.flush();
            }
            pruneAutoBackups();
            JSObject out = new JSObject();
            out.put("name", outFile.getName());
            out.put("modified", outFile.lastModified());
            out.put("size", outFile.length());
            out.put("reason", safeReason);
            call.resolve(out);
        } catch (Exception e) {
            call.reject("Could not create auto-backup", e);
        }
    }

    @PluginMethod
    public void listAutoBackups(PluginCall call) {
        try {
            File[] files = autoBackupDir().listFiles((dir, name) -> name != null && name.endsWith(".json"));
            if (files == null) files = new File[0];
            Arrays.sort(files, (a, b) -> Long.compare(b.lastModified(), a.lastModified()));
            JSArray items = new JSArray();
            for (File file : files) {
                JSObject item = new JSObject();
                item.put("name", file.getName());
                item.put("modified", file.lastModified());
                item.put("size", file.length());
                String name = file.getName();
                String reason = "auto";
                int first = name.indexOf('-', 7);
                int last = name.lastIndexOf(".json");
                if (first >= 0 && last > first) reason = name.substring(first + 1, last);
                item.put("reason", reason);
                items.put(item);
            }
            JSObject out = new JSObject();
            out.put("items", items);
            call.resolve(out);
        } catch (Exception e) {
            call.reject("Could not list auto-backups", e);
        }
    }

    @PluginMethod
    public void readAutoBackup(PluginCall call) {
        String name = call.getString("name");
        if (name == null || name.trim().isEmpty() || !new File(name).getName().equals(name)) {
            call.reject("Invalid backup name");
            return;
        }
        File file = new File(autoBackupDir(), name);
        if (!file.exists() || !file.isFile()) {
            call.reject("Backup not found");
            return;
        }
        try (FileInputStream is = new FileInputStream(file);
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
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
            out.put("name", file.getName());
            out.put("modified", file.lastModified());
            call.resolve(out);
        } catch (Exception e) {
            call.reject("Could not read auto-backup", e);
        }
    }

    private boolean notificationsAllowed() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
            && ContextCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            return false;
        }
        return NotificationManagerCompat.from(getContext()).areNotificationsEnabled();
    }

    @PluginMethod
    public void scheduleDailyReminder(PluginCall call) {
        String time = call.getString("time");
        String title = call.getString("title");
        String body = call.getString("body");
        if (time == null || !time.matches("^(?:[01]\\d|2[0-3]):[0-5]\\d$")) {
            call.reject("Invalid reminder time");
            return;
        }
        try {
            ReminderScheduler.schedule(getContext(), time, title, body);
            JSObject out = new JSObject();
            out.put("enabled", true);
            out.put("time", time);
            out.put("notificationsAllowed", notificationsAllowed());
            out.put("nextTrigger", ReminderScheduler.nextTriggerMillis(time));
            call.resolve(out);
        } catch (Exception e) {
            call.reject("Could not schedule reminder", e);
        }
    }

    @PluginMethod
    public void cancelDailyReminder(PluginCall call) {
        try {
            ReminderScheduler.cancel(getContext());
            JSObject out = new JSObject();
            out.put("enabled", false);
            out.put("notificationsAllowed", notificationsAllowed());
            call.resolve(out);
        } catch (Exception e) {
            call.reject("Could not cancel reminder", e);
        }
    }

    @PluginMethod
    public void getReminderStatus(PluginCall call) {
        JSObject out = new JSObject();
        out.put("enabled", ReminderScheduler.isEnabled(getContext()));
        out.put("time", ReminderScheduler.getTime(getContext()));
        out.put("notificationsAllowed", notificationsAllowed());
        call.resolve(out);
    }

    @PluginMethod
    public void requestNotificationPermission(PluginCall call) {
        try {
            boolean allowed = notificationsAllowed();
            boolean requested = false;
            if (!allowed && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                ActivityCompat.requestPermissions(
                    getActivity(),
                    new String[]{Manifest.permission.POST_NOTIFICATIONS},
                    16003
                );
                requested = true;
            }
            JSObject out = new JSObject();
            out.put("allowed", allowed);
            out.put("requested", requested);
            call.resolve(out);
        } catch (Exception e) {
            call.reject("Could not request notification permission", e);
        }
    }

    @PluginMethod
    public void openNotificationSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            intent.putExtra(Settings.EXTRA_APP_PACKAGE, getContext().getPackageName());
            getActivity().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Could not open notification settings", e);
        }
    }

    @PluginMethod
    public void getAppInfo(PluginCall call) {
        try {
            PackageInfo info = getContext().getPackageManager().getPackageInfo(getContext().getPackageName(), 0);
            JSObject out = new JSObject();
            out.put("versionName", info.versionName == null ? "" : info.versionName);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) out.put("versionCode", info.getLongVersionCode());
            else out.put("versionCode", info.versionCode);
            out.put("packageName", getContext().getPackageName());
            call.resolve(out);
        } catch (Exception e) {
            call.reject("Could not read app info", e);
        }
    }

    @PluginMethod
    public void checkForUpdate(PluginCall call) {
        new Thread(() -> {
            HttpURLConnection connection = null;
            try {
                URL url = new URL("https://api.github.com/repos/TokhirjonYuldoshev/BP-Diary-Android/releases/latest");
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.setConnectTimeout(8000);
                connection.setReadTimeout(8000);
                connection.setRequestProperty("Accept", "application/vnd.github+json");
                connection.setRequestProperty("User-Agent", "BP-Diary-Android");
                int code = connection.getResponseCode();
                if (code < 200 || code >= 300) throw new IllegalStateException("GitHub returned HTTP " + code);
                StringBuilder body = new StringBuilder();
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        body.append(line);
                        if (body.length() > 1024 * 1024) throw new IllegalStateException("Update response too large");
                    }
                }
                JSONObject json = new JSONObject(body.toString());
                String apkUrl = "";
                JSONArray assets = json.optJSONArray("assets");
                if (assets != null) {
                    for (int i = 0; i < assets.length(); i++) {
                        JSONObject asset = assets.optJSONObject(i);
                        if (asset == null) continue;
                        String name = asset.optString("name", "");
                        if (name.toLowerCase(Locale.ROOT).endsWith(".apk")) {
                            apkUrl = asset.optString("browser_download_url", "");
                            break;
                        }
                    }
                }
                PackageInfo pkg = getContext().getPackageManager().getPackageInfo(getContext().getPackageName(), 0);
                JSObject out = new JSObject();
                out.put("tag", json.optString("tag_name", ""));
                out.put("name", json.optString("name", ""));
                out.put("htmlUrl", json.optString("html_url", ""));
                out.put("apkUrl", apkUrl);
                out.put("publishedAt", json.optString("published_at", ""));
                out.put("currentVersion", pkg.versionName == null ? "" : pkg.versionName);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) out.put("currentCode", pkg.getLongVersionCode());
                else out.put("currentCode", pkg.versionCode);
                getActivity().runOnUiThread(() -> call.resolve(out));
            } catch (Exception e) {
                getActivity().runOnUiThread(() -> call.reject("Could not check GitHub release", e));
            } finally {
                if (connection != null) connection.disconnect();
            }
        }, "bp-diary-update-check").start();
    }

    @PluginMethod
    public void openUrl(PluginCall call) {
        String url = call.getString("url");
        if (url == null || url.trim().isEmpty()) {
            call.reject("No URL");
            return;
        }
        try {
            Uri uri = Uri.parse(url);
            String scheme = uri.getScheme();
            if (!"https".equalsIgnoreCase(scheme) && !"http".equalsIgnoreCase(scheme)) {
                call.reject("Unsupported URL scheme");
                return;
            }
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            getActivity().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Could not open URL", e);
        }
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
    <path android:fillColor="#FFF4F5" android:pathData="M0,0h108v108h-108z" />
    <path android:fillColor="#FFFFFF" android:pathData="M13,13h82a13,13 0,0 1,13 13v56a13,13 0,0 1,-13 13h-82a13,13 0,0 1,-13 -13v-56a13,13 0,0 1,13 -13z" />
    <path android:fillColor="#FAD7DA" android:pathData="M54,13a41,41 0,1 0,0.1 0z" android:fillAlpha="0.32" />
    <path android:fillColor="#D71932" android:pathData="M54,91C48,85 22,69 22,43C22,27 33,18 46,18C54,18 60,22 64,29C68,22 74,18 82,18C95,18 106,27 106,43C106,69 80,85 54,91Z" />
    <path android:fillColor="#F35C62" android:pathData="M31,30C37,22 47,21 54,27C45,25 37,28 32,36z" android:fillAlpha="0.70" />
    <path
        android:fillColor="@android:color/transparent"
        android:strokeColor="#FFFFFF"
        android:strokeWidth="5"
        android:strokeLineCap="round"
        android:strokeLineJoin="round"
        android:pathData="M31,53L42,53L47,40L56,67L63,50L69,57L80,57" />
</vector>
`,'utf8');

await writeFile(join(resDrawable,'bp_diary_notification.xml'),`<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FFFFFFFF"
        android:pathData="M12,21C10.4,19.4 4,15.4 4,9.4C4,6 6.2,4 9,4C10.6,4 11.7,4.7 12.6,6C13.5,4.7 14.6,4 16.2,4C19,4 21,6 21,9.4C21,15.4 14.9,19.4 12,21Z" />
    <path
        android:fillColor="#00000000"
        android:strokeColor="#FFFFFFFF"
        android:strokeWidth="1.6"
        android:strokeLineCap="round"
        android:strokeLineJoin="round"
        android:pathData="M6.8,11.4L9.2,11.4L10.1,9L12.2,14.2L13.4,11.2L14.5,12.5L17.2,12.5" />
</vector>
`,'utf8');


const manifestPath=join(app,'src','main','AndroidManifest.xml');
let manifest=await readFile(manifestPath,'utf8');
if(!manifest.includes('android.permission.POST_NOTIFICATIONS')){
  manifest=manifest.replace(/<application\b/, `<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.INTERNET" />
    <application`);
}

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
        <receiver
            android:name=".ReminderReceiver"
            android:enabled="true"
            android:exported="false">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.TIME_SET" />
                <action android:name="android.intent.action.TIMEZONE_CHANGED" />
            </intent-filter>
        </receiver>
    </application>`);
}
if(!manifest.includes('.ReminderReceiver')){
  manifest=manifest.replace('</application>',`        <receiver
            android:name=".ReminderReceiver"
            android:enabled="true"
            android:exported="false">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.TIME_SET" />
                <action android:name="android.intent.action.TIMEZONE_CHANGED" />
            </intent-filter>
        </receiver>
    </application>`);
}
await writeFile(manifestPath,manifest,'utf8');

console.log('Patched Android native bridge and permanent signing configuration.');
