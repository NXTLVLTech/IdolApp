package cordova.plugin;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.app.ActivityCompat;
import android.widget.Toast;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * This class echoes a string called from JavaScript.
 */
public class photoeditor_tool extends CordovaPlugin {

    private static final int REQUEST_CODE_PICK_GALLERY = 0x1;
    private static final int REQUEST_CODE_TAKE_PICTURE = 0x2;


    private static final int REQUEST_CODE_GALLERY_CROP = 0x3;
    private static final int REQUEST_CODE_TAKE_CROP = 0x4;

    private Activity activity;

    private static String[] PERMISSIONS_STORAGE = {
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.CAMERA
    };

    private static final int REQUEST_EXTERNAL_STORAGE = 1;

    public CallbackContext mCBContext;

    public static String cropFilePath = "" ;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        mCBContext = callbackContext;

        this.cordova.setActivityResultCallback(this);

        if (action.equals("takeCamera")) {
            String message = args.getString(0);
            this.takeCamera(message, callbackContext, message);
            return true;

        }else if(action.equals("takeLibrary")){

            String message = args.getString(0);
            this.takeLibrary(message, callbackContext, message);
            return true;
        }

        return false;
    }


    private void takeCamera(String message, CallbackContext callbackContext, String keyParam) {

        activity = this.cordova.getActivity();

        int permission = ActivityCompat.checkSelfPermission(this.cordova.getActivity(), Manifest.permission.CAMERA);

        if (permission != PackageManager.PERMISSION_GRANTED) {
            // We don't have permission so prompt the user
            ActivityCompat.requestPermissions(
                    this.cordova.getActivity(),
                    PERMISSIONS_STORAGE,
                    REQUEST_EXTERNAL_STORAGE
            );
        }

         Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (takePictureIntent.resolveActivity(this.cordova.getActivity().getPackageManager()) != null) {
                    this.cordova.getActivity().startActivityForResult(takePictureIntent, REQUEST_CODE_TAKE_PICTURE);

        }

    }

    private void takeLibrary(String message, CallbackContext callbackContext, String keyParam) {
       activity = this.cordova.getActivity();

        int permission = ActivityCompat.checkSelfPermission(this.cordova.getActivity(), Manifest.permission.WRITE_EXTERNAL_STORAGE);

        if (permission != PackageManager.PERMISSION_GRANTED) {
            // We don't have permission so prompt the user
            ActivityCompat.requestPermissions(
                    this.cordova.getActivity(),
                    PERMISSIONS_STORAGE,
                    REQUEST_EXTERNAL_STORAGE
            );
        }

       Intent intent = new Intent();
                intent.setType("image/*");
                intent.setAction(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                 this.cordova.getActivity().startActivityForResult(Intent.createChooser(intent, "Gallery"), REQUEST_CODE_PICK_GALLERY);
    }


    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        if (requestCode == REQUEST_CODE_TAKE_PICTURE && resultCode == Activity.RESULT_OK) {


            Toast.makeText(this.cordova.getActivity(), "Media captured.", Toast.LENGTH_SHORT).show();
            String myNewFileString = Environment.getExternalStorageDirectory() + "/Pictures/IdolCapture/";
            File myNewFile = new File(myNewFileString);
            if (!myNewFile.exists())
            {
                myNewFile.mkdirs();
            }
            Toast.makeText(this.cordova.getActivity(), myNewFileString, Toast.LENGTH_SHORT).show();

            Bitmap imageBitmap = (Bitmap) data.getExtras().get("data");

            File newPicFile = new File(myNewFile.getPath(), System.currentTimeMillis() + ".png");

            FileOutputStream out = null;
            try {
                out = new FileOutputStream(newPicFile);
                imageBitmap.compress(Bitmap.CompressFormat.PNG, 100, out); // bmp is your Bitmap instance
                // PNG is a lossless format, the compression factor (100) is ignored
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                try {
                    if (out != null) {
                        out.close();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }



            MediaScannerConnection.scanFile(this.cordova.getActivity(), new String[]{myNewFile.getPath()}, new String[]{"image/jpeg"}, null);
            Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
            for (File f : myNewFile.listFiles())
            {
                Uri contentUri = Uri.fromFile(f);
                mediaScanIntent.setData(contentUri);
                this.cordova.getActivity().sendBroadcast(mediaScanIntent);
            }

            this.cordova.getActivity().sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.fromFile(myNewFile)));

            final Uri selectedUri = Uri.fromFile(newPicFile);
            String selectedString = selectedUri.toString();

            this.cordova.setActivityResultCallback(this);
            Intent intent = new Intent(this.cordova.getActivity(),CircleCropActivity.class);
            intent.putExtra("picUrl", selectedString);
            this.cordova.getActivity().startActivityForResult(intent, REQUEST_CODE_TAKE_CROP);


        }else if (requestCode == REQUEST_CODE_PICK_GALLERY && resultCode == Activity.RESULT_OK) {

            final Uri selectedUri = data.getData();
            String selectedString = selectedUri.toString();
            Intent intent = new Intent(this.cordova.getActivity(),CircleCropActivity.class);

            intent.putExtra("picUrl", selectedString);
            this.cordova.setActivityResultCallback(this);
            this.cordova.getActivity().startActivityForResult(intent, REQUEST_CODE_GALLERY_CROP);

        }else if(requestCode == REQUEST_CODE_GALLERY_CROP && resultCode == Activity.RESULT_OK ){

            this.mCBContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, cropFilePath));

        }else if(requestCode == REQUEST_CODE_GALLERY_CROP && resultCode == Activity.RESULT_CANCELED){

            this.mCBContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR));

        }else if(requestCode == REQUEST_CODE_TAKE_CROP && resultCode == Activity.RESULT_OK ){

            this.mCBContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, cropFilePath));

        }else if(requestCode == REQUEST_CODE_TAKE_CROP && resultCode == Activity.RESULT_CANCELED){

            this.mCBContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR));
        }

    }
}
