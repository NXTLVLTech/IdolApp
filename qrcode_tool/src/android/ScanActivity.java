package cordova.plugin;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.Rect;
import android.hardware.Camera;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.ActivityCompat;
import android.util.AttributeSet;
import android.util.Log;
import android.util.TypedValue;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.google.zxing.Result;

import me.dm7.barcodescanner.core.DisplayUtils;
import me.dm7.barcodescanner.core.IViewFinder;
import me.dm7.barcodescanner.core.ViewFinderView;
import me.dm7.barcodescanner.zxing.ZXingScannerView;

import com.idolapp.idol.R;

public class ScanActivity extends Activity implements ZXingScannerView.ResultHandler{

    private ZXingScannerView mScannerView;

    private final String TAG = "ZHANG PHIL";
    public static final int PERMISSION_REQUEST = 0xa00;

    private ImageView img_cancel, img_light;

    boolean cancel_status = false, light_status = false ;

    private boolean hasFlash;
    private Camera camera;
    private Camera.Parameters parameter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scan);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA /*, Manifest.permission.WRITE_EXTERNAL_STORAGE*/}, PERMISSION_REQUEST);
        }

        LinearLayout cancel_layout = (LinearLayout) findViewById(R.id.cancel_layout);
        LinearLayout light_layout = (LinearLayout) findViewById(R.id.light_layout);

        img_cancel = (ImageView) findViewById(R.id.img_cancel);
        img_light = (ImageView) findViewById(R.id.img_light);
        img_cancel.setImageResource(R.drawable.cancel_default);
        img_light.setImageResource(R.drawable.light_default);

        cancel_layout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (cancel_status)
                {
                    img_cancel.setImageResource(R.drawable.cancel_default);
                }else{
                    img_cancel.setImageResource(R.drawable.cancel_active);
                }
                cancel_status = !cancel_status;
                Intent intent = new Intent();
                setResult(Activity.RESULT_CANCELED, intent);
                finish();
            }
        });

        light_layout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(hasFlash){
                    if (light_status)
                    {
                        img_light.setImageResource(R.drawable.light_default);

                        mScannerView.setFlash(false);
                    }else{
                        img_light.setImageResource(R.drawable.light_active);
                        mScannerView.setFlash(true);
                    }
                    light_status = !light_status;
                }
            }
        });
        setupScanner();


        hasFlash = getApplicationContext().getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_FLASH);
        if (!hasFlash) {
            // Device doesn't support flash
            // Show alert message and close the application
            AlertDialog.Builder alertDialog = new AlertDialog.Builder(this);
            alertDialog.setTitle("Error");
            alertDialog.setMessage("Sorry, your device doesn't support flash light!");
            alertDialog.setNegativeButton("OK", new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int id) {
                    // Closing the application
                    dialog.cancel();
                }
            });
            alertDialog.show();
        }

    }

    void setupScanner(){
        ViewGroup contentFrame = (ViewGroup) findViewById(R.id.content_frame);
        mScannerView = new ZXingScannerView(this){
            @Override
            protected IViewFinder createViewFinderView(Context context) {
                return new CustomViewFinderView(context);
            }
        };
        mScannerView.setAspectTolerance(1f);
        contentFrame.addView(mScannerView);
    }

    @Override
    public void onResume() {
        super.onResume();
        mScannerView.setResultHandler(this);
        //mScannerView.setFormats(BarcodeFormat.QR_CODE
        mScannerView.startCamera();
    }

    @Override
    public void onPause() {
        super.onPause();
        mScannerView.stopCamera();
    }

    @Override
    public void handleResult(Result rawResult) {
        String str_detectedData = rawResult.getText();
        Intent intent = new Intent();
        Global.qr_result = str_detectedData;
        setResult(Activity.RESULT_OK, intent);
        finish();

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {

        switch (requestCode) {
            case PERMISSION_REQUEST:
                if (grantResults != null && permissions != null) {
                    /*for (int i = 0; i < grantResults.length; i++) {
                        Log.d(TAG, "grantResults[" + i + "]:" + grantResults[i]);
                        Log.d(TAG, "permissions[" + i + "]:" + permissions[i]);
                    }*/
                    if(grantResults[0]==0){
                        //setupScanner();
                        mScannerView.startCamera();
                    }else{
                        Toast.makeText(this, "Cannot Scan QR code",Toast.LENGTH_SHORT).show();;
                        finish();
                    }
                }
                break;
        }
    }


    private static class CustomViewFinderView extends ViewFinderView {
        public static final int TRADE_MARK_TEXT_SIZE_SP = 30;
        public final Paint PAINT = new Paint();

        public CustomViewFinderView(Context context) {
            super(context);
            init();
        }

        public CustomViewFinderView(Context context, AttributeSet attrs) {
            super(context, attrs);
            init();
        }

        private void init() {
            PAINT.setColor(Color.WHITE);
            PAINT.setAntiAlias(true);
            float textPixelSize = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP,
                    TRADE_MARK_TEXT_SIZE_SP, getResources().getDisplayMetrics());
            PAINT.setTextSize(textPixelSize);
            setSquareViewFinder(true);
            setMaskColor(Color.alpha(0));
        }

        @Override
        public void onDraw(Canvas canvas) {
            super.onDraw(canvas);
            drawViewFinderBorder(canvas);
        }

        public void drawViewFinderBorder(Canvas canvas) {
            Rect framingRect = getFramingRect();
            Bitmap square_rect = BitmapFactory.decodeResource(getResources(), R.drawable.scan_square);
            Rect dstRect = new Rect(framingRect.left - 20, framingRect.top - 20,framingRect.right + 20, framingRect.bottom + 20);
            canvas.drawBitmap(square_rect, null,dstRect,null);

        }

        private static float SQUARE_DIMENSION_RATIO = 5f/8;
        private static float LANDSCAPE_HEIGHT_RATIO = 5f/8;
        private static float LANDSCAPE_WIDTH_HEIGHT_RATIO = 1.4f;

        private static float PORTRAIT_WIDTH_RATIO = 6f/8;
        private static float PORTRAIT_WIDTH_HEIGHT_RATIO = 0.75f;

        private static int MIN_DIMENSION_DIFF = 50;
        private Rect mFramingRect;

        private static final long ANIMATION_DELAY = 80l;
        private static final int[] SCANNER_ALPHA = {0, 64, 128, 192, 255, 192, 128, 64};
        private int scannerAlpha;
        private static final int POINT_SIZE = 10;

        public synchronized void updateFramingRect() {
            Point viewResolution = new Point(getWidth(), getHeight());
            int width;
            int height;
            int orientation = DisplayUtils.getScreenOrientation(getContext());

            if(mSquareViewFinder) {
                if(orientation != Configuration.ORIENTATION_PORTRAIT) {
                    height = (int) (getHeight() * SQUARE_DIMENSION_RATIO);
                    width = height;
                } else {
                    width = (int) (getWidth() * SQUARE_DIMENSION_RATIO);
                    height = width;
                }
            } else {
                if(orientation != Configuration.ORIENTATION_PORTRAIT) {
                    height = (int) (getHeight() * LANDSCAPE_HEIGHT_RATIO);
                    width = (int) (LANDSCAPE_WIDTH_HEIGHT_RATIO * height);
                } else {
                    width = (int) (getWidth() * PORTRAIT_WIDTH_RATIO);
                    height = (int) (PORTRAIT_WIDTH_HEIGHT_RATIO * width);
                }
            }

            if(width > getWidth()) {
                width = getWidth() - MIN_DIMENSION_DIFF;
            }

            if(height > getHeight()) {
                height = getHeight() - MIN_DIMENSION_DIFF;
            }

            /*int leftOffset = (viewResolution.x - width) / 2;
            int topOffset = (viewResolution.y - height) / 2;
            mFramingRect = new Rect(leftOffset, topOffset, leftOffset + width, topOffset + height);*/

            int leftOffset = (viewResolution.x - width) / 2;
            int topOffset = (viewResolution.y - height) / 2;
            mFramingRect = new Rect(leftOffset, topOffset, leftOffset + width, topOffset + height);
        }

        public Rect getFramingRect() {
            return mFramingRect;
        }
    }


    // Get the camera
    private void getCamera() {
        if (camera == null) {
            try {
                camera = Camera.open();
                parameter = camera.getParameters();
            } catch (RuntimeException re) {
                Log.e("Camera Error. Failed to Open. Error: ", re.getMessage());
                re.printStackTrace();
            } catch (Exception ex) {
                Log.e(TAG, "Exception: getCamera");
                Log.e(TAG, ex.getMessage());
                ex.printStackTrace();
            }
        }
    }

}
