package cordova.plugin;

import android.app.Activity;
import android.content.Intent;

import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;

import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;

import android.view.View;
import android.widget.ImageButton;


import com.steelkiwi.cropiwa.CropIwaView;
import com.steelkiwi.cropiwa.config.CropIwaSaveConfig;
import com.steelkiwi.cropiwa.shape.CropIwaOvalShape;

import java.io.File;

import com.idolapp.idol.R;

public class CircleCropActivity extends Activity {

    private CropIwaView cropView;
    private float currentRotate = 0.0f;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_circlecrop);


        Bundle extras = getIntent().getExtras();
        String imageString = extras.getString("picUrl");



        Uri imageUri = Uri.parse(imageString);

        cropView = (CropIwaView) findViewById(R.id.crop_view);

        cropView.configureOverlay()
                .setCropShape(new CropIwaOvalShape(cropView.configureOverlay()))
                .setGridColor(Color.TRANSPARENT)
                .setBorderColor(Color.TRANSPARENT)
                .apply();

        cropView.setRotation(currentRotate);
        cropView.setImageUri(imageUri);


        ImageButton buttonRotateLeft = (ImageButton) findViewById(R.id.buttonRotateLeft);

        buttonRotateLeft.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                currentRotate = currentRotate - 90.0f;
                if(currentRotate < -360.f)
                {
                    currentRotate = 0.0f;
                    cropView.setRotation(0.0f);
                }else{
                    cropView.setRotation(currentRotate);
                }

            }
        });

        ImageButton buttonRotateRight = (ImageButton) findViewById(R.id.buttonRotateRight);

        buttonRotateRight.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                currentRotate = currentRotate + 90.0f;
                if(currentRotate > 360.f )
                {
                    currentRotate = 0.0f;
                    cropView.setRotation(0.0f);
                }else{
                    cropView.setRotation(currentRotate);
                }
            }
        });

        ImageButton backButton = (ImageButton) findViewById(R.id.buttonPickImage);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent returnIntent = new Intent();
                setResult(Activity.RESULT_CANCELED, returnIntent);
                finish();
            }
        });


        ImageButton buttonDone = (ImageButton) findViewById(R.id.buttonDone);

        buttonDone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                File directory = new File(Environment.getExternalStorageDirectory().getAbsolutePath()+"/Pictures/IdolPic/");

                if(!directory.exists()){
                    directory.mkdirs();
                }

                Uri dstPath = Uri.fromFile(new File(
                        directory.getPath(),
                        System.currentTimeMillis() + ".png"));

                cropView.crop(new CropIwaSaveConfig.Builder(dstPath)
                        .setCompressFormat(Bitmap.CompressFormat.PNG)
                        .setQuality(100) //Hint for lossy compression formats
                        .build());


                cropView.setCropSaveCompleteListener(new CropIwaView.CropSaveCompleteListener() {
                    @Override
                    public void onCroppedRegionSaved(Uri bitmapUri) {
                        Intent returnIntent = new Intent();
                        photoeditor_tool.cropFilePath = bitmapUri.toString();
                        setResult(Activity.RESULT_OK, returnIntent);
                        finish();

                    }
                });

                cropView.setErrorListener(new CropIwaView.ErrorListener() {
                    @Override
                    public void onError(Throwable e) {
                        Intent returnIntent = new Intent();
                        setResult(Activity.RESULT_CANCELED, returnIntent);
                        finish();
                    }
                });


            }
        });

    }


}
