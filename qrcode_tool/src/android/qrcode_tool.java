package cordova.plugin;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Build;
import android.os.Environment;
import android.support.v4.app.ActivityCompat;

import com.google.zxing.WriterException;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * This class echoes a string called from JavaScript.
 */
public class qrcode_tool extends CordovaPlugin {

    public CallbackContext mCBContext;
    public static final int PERMISSION_REQUEST = 0xa01;
    public String qr_generator_id = "";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        mCBContext = callbackContext;

        this.cordova.setActivityResultCallback(this);


        if (action.equals("getScanCode")) {
            String message = args.getString(0);
            this.getScanCode(message, callbackContext, message);
            return true;
        }else if(action.equals("getQRCode")){
            String message = args.getString(0);
            try {
                this.getQRCode(message, callbackContext, message);
            } catch (WriterException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return true;
        }
        return false;
    }


    private void getScanCode(String message, CallbackContext callbackContext, String keyParam) {

        if (keyParam.equals("Camera")){
            Intent intent = new Intent(cordova.getActivity().getApplicationContext(), ScanActivity.class);
            this.cordova.getActivity().startActivityForResult(intent, 1);
        }
    }


    private void getQRCode(String message, CallbackContext callbackContext, String keyParam) throws WriterException, IOException  {
        qr_generator_id = keyParam;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            //         ActivityCompat.requestPermissions(this.cordova.getActivity(), new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE /*, Manifest.permission.WRITE_EXTERNAL_STORAGE*/}, PERMISSION_REQUEST);
            this.cordova.requestPermission(this,PERMISSION_REQUEST,new String(Manifest.permission.WRITE_EXTERNAL_STORAGE ));
        }else{
            qr_generator_id = keyParam;
            Bitmap qrCode = new QrGenerator.Builder()
                    .content(keyParam)
                    .qrSize(400)
                    .margin(2)
                    .color(Color.WHITE)
                    .bgColor(android.R.color.transparent)
                    .encode();
            if(qrCode != null){
                File pictureFile = getOutputMediaFile();
                if (pictureFile == null) {

                    return;
                }
                FileOutputStream fos = new FileOutputStream(pictureFile);
                qrCode.compress(Bitmap.CompressFormat.PNG, 90, fos);
                fos.close();
                this.mCBContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, pictureFile.getAbsolutePath()));
            }else {
                this.mCBContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR));
            }
        }


    }

    /** Create a File for saving an image or video */
    private  File getOutputMediaFile(){
        // To be safe, you should check that the SDCard is mounted
        // using Environment.getExternalStorageState() before doing this.
        File mediaStorageDir = new File(Environment.getExternalStorageDirectory()
                + "/Android/data/"
                + this.cordova.getActivity().getBaseContext().getPackageName()
                + "/Files");

        // This location works best if you want the created images to be shared
        // between applications and persist after your app has been uninstalled.

        // Create the storage directory if it does not exist
        if (! mediaStorageDir.exists()){
            if (! mediaStorageDir.mkdirs()){
                return null;
            }
        }
        // Create a media file name
        File mediaFile;
        String mImageName="myQRCode.png";
        mediaFile = new File(mediaStorageDir.getPath() + File.separator + mImageName);
        return mediaFile;
    }

    public void onActivityResult(int requestCode, int resultCode, Intent intent){
        super.onActivityResult(requestCode, resultCode, intent);
        if(requestCode == 1)
        {
            if(resultCode == Activity.RESULT_OK)
            {
                this.mCBContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, Global.qr_result));
            }else{

                this.mCBContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR));
            }


        }
    }

    @Override
    public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException {
        super.onRequestPermissionResult(requestCode, permissions, grantResults);

        switch (requestCode) {
            case PERMISSION_REQUEST: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {


                    Bitmap qrCode = null;
                    try {
                        qrCode = new QrGenerator.Builder()
                                .content(qr_generator_id)
                                .qrSize(400)
                                .margin(2)
                                .color(Color.WHITE)
                                .bgColor(android.R.color.transparent)
                                .encode();
                        if(qrCode != null){
                            File pictureFile = getOutputMediaFile();
                            if (pictureFile == null) {

                                return;
                            }
                            FileOutputStream fos = new FileOutputStream(pictureFile);
                            qrCode.compress(Bitmap.CompressFormat.PNG, 90, fos);
                            fos.close();
                            this.mCBContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, pictureFile.getAbsolutePath()));
                        }else {
                            this.mCBContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR));
                        }

                    } catch (WriterException e) {
                        e.printStackTrace();
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                } else {
                    // permission denied, boo! Disable the
                    // functionality that depends on this permission.
                    this.mCBContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR));
                }
                return;
            }
            // other 'case' lines to check for other
            // permissions this app might request
        }
    }
}
