//
//  DYQRCodeDecoderViewController.m
//  QRCode-Decoder
//
//  Created by Dwarven on 16/7/5.
//  Copyright © 2016 Dwarven. All rights reserved.
//

#import "DYQRCodeDecoderViewController.h"
#import <AVFoundation/AVFoundation.h>

#define SCREEN_WIDTH  [[UIScreen mainScreen] bounds].size.width
#define SCREEN_HEIGHT [[UIScreen mainScreen] bounds].size.height

@interface DYQRCodeDecoderViewController () <
AVCaptureMetadataOutputObjectsDelegate> {
    void(^_completion)(BOOL, NSString *);
    NSMutableArray *_observers;
    UIView *_viewPreview;
    UIImageView * _lineImageView;
    CGRect _lineRect0;
    CGRect _lineRect1;
}

@property (nonatomic, strong, readwrite) UIButton *CancelBtn;
@property (nonatomic, strong, readwrite) UIButton *TorchBtn;

@property (nonatomic, strong, readwrite) UIView  *CancelView;
@property (nonatomic, strong, readwrite) UIImageView  *Cancelimage;
@property (nonatomic, strong, readwrite) UILabel  *CancelLabel;
@property (nonatomic, strong, readwrite) UIView  *TorchView;
@property (nonatomic, strong, readwrite) UIImageView  *TorchImage;
@property (nonatomic, strong, readwrite) UILabel  *TorchLabel;


@property (nonatomic, strong, readwrite) UIView  *topView;
@property (nonatomic, strong, readwrite) UILabel *scanTitle;



@property (nonatomic, strong) AVCaptureSession *captureSession;
@property (nonatomic, strong) AVCaptureVideoPreviewLayer *videoPreviewLayer;
@property (nonatomic) BOOL isReading;

@end

@implementation DYQRCodeDecoderViewController

- (void)dealloc{
 //   [self cleanNotifications];
    _observers = nil;
    _viewPreview = nil;
    _lineImageView = nil;
    _completion = NULL;

    self.captureSession = nil;
    self.videoPreviewLayer = nil;
    self.CancelBtn = nil ;
    self.TorchBtn = nil ;
    
    self.frameImage = nil;
    self.lineImage = nil;

}


- (id)initWithCompletion:(void (^)(BOOL, NSString *))completion{
    self = [super init];
    if (self) {
        _needsScanAnnimation = YES;
        _completion = completion;
        _frameImage = [UIImage imageNamed:@"img_animation_scan_pic" inBundle:[NSBundle bundleForClass:[DYQRCodeDecoderViewController class]] compatibleWithTraitCollection:nil];
        _lineImage = [UIImage imageNamed:@"img_animation_scan_line" inBundle:[NSBundle bundleForClass:[DYQRCodeDecoderViewController class]] compatibleWithTraitCollection:nil];
        
        
        CGFloat mainwidth = [UIScreen mainScreen].bounds.size.width ;
        CGFloat mainHeight = [UIScreen mainScreen].bounds.size.height;
        
        self.CancelView = [[UIView alloc] initWithFrame:CGRectMake(0, mainHeight - 60, mainwidth /2, 60.0)];
        self.CancelView.backgroundColor = [UIColor whiteColor];
        
        
        self.CancelBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [self.CancelBtn addTarget:self action:@selector(cancelAction:) forControlEvents:UIControlEventTouchUpInside];
        self.CancelBtn.frame = CGRectMake(0, 0, mainwidth /2, 60.0);
        
        
        self.CancelLabel =[[UILabel alloc] initWithFrame:CGRectMake(0, 40, mainwidth /2, 20.0)];
        self.CancelLabel.text = @"Cancel" ;
        self.CancelLabel.font = [UIFont fontWithName:@"ProximaNovaSemibold" size:16];
        self.CancelLabel.backgroundColor = [UIColor clearColor];
        self.CancelLabel.textColor = [UIColor colorWithRed:189/255.f green:202/255.f blue:219/255.f alpha:1.0f];
        self.CancelLabel.textAlignment = NSTextAlignmentCenter;
        
        self.Cancelimage = [[UIImageView alloc] initWithFrame:CGRectMake( (mainwidth /4 -12 ), 8, 24, 24)];
        self.Cancelimage.image = [UIImage imageNamed:@"Cancel-Default.png"];
        
        [self.CancelView addSubview:self.Cancelimage];
        [self.CancelView addSubview:self.CancelLabel];
        [self.CancelView addSubview:self.CancelBtn];
        
        //////TorchView
        
        self.TorchView = [[UIView alloc] initWithFrame:CGRectMake(mainwidth/2, mainHeight - 60, mainwidth /2, 60.0)];
        self.TorchView.backgroundColor = [UIColor whiteColor];
        
        
        self.TorchBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [self.TorchBtn addTarget:self action:@selector(btnFlashOnClicked:) forControlEvents:UIControlEventTouchUpInside];
        self.TorchBtn.frame = CGRectMake(0, 0, mainwidth /2, 60.0);
        
        
        self.TorchLabel =[[UILabel alloc] initWithFrame:CGRectMake(0, 40, mainwidth /2, 20.0)];
        self.TorchLabel.text = @"Light" ;
        self.TorchLabel.font = [UIFont fontWithName:@"ProximaNovaSemibold" size:16];
        self.TorchLabel.backgroundColor = [UIColor clearColor];
        self.TorchLabel.textColor = [UIColor colorWithRed:189/255.f green:202/255.f blue:219/255.f alpha:1.0f];
        self.TorchLabel.textAlignment = NSTextAlignmentCenter;
        
        self.TorchImage = [[UIImageView alloc] initWithFrame:CGRectMake( (mainwidth /4 -15 ), 5, 30, 30)];
        self.TorchImage.image = [UIImage imageNamed:@"Light-Default.png"];
        
        [self.TorchView addSubview:self.TorchImage];
        [self.TorchView addSubview:self.TorchLabel];
        [self.TorchView addSubview:self.TorchBtn];
        

        
        
        
        
        self.topView = [[UIView alloc] initWithFrame:CGRectMake(0, 0,mainwidth, 80)];
        [self.topView setBackgroundColor:[UIColor colorWithRed:41/255.f green:57/255.f blue:180/255.f alpha:1.0f]];
        
        self.scanTitle =[[UILabel alloc] initWithFrame:CGRectMake( (mainwidth - 200)/2, 50,200, 30)];
        self.scanTitle.text = @"QR Code Scanner" ;
        self.scanTitle.font = [UIFont fontWithName:@"ProximaNovaSemibold" size:24];
        self.scanTitle.backgroundColor = [UIColor clearColor];
        self.scanTitle.textColor = [UIColor whiteColor];
        self.scanTitle.textAlignment = NSTextAlignmentCenter;
        
        [self.topView addSubview:self.scanTitle];

        
    }
    return self;
}

- (void)viewDidLayoutSubviews{
    [super viewDidLayoutSubviews];
    [self.navigationController setNavigationBarHidden:YES];
    [self startReading];
}

- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    if (_needsScanAnnimation) {
        [UIView animateWithDuration:2 delay:0 options:UIViewAnimationOptionRepeat animations:^{
            [_lineImageView setFrame:_lineRect1];
        } completion:^(BOOL finished) {
            [_lineImageView setFrame:_lineRect0];
        }];
    }
}

- (void)viewDidAppear:(BOOL)animated{
    
    [super viewDidAppear:animated];
    [self startReading];
}

- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    [self stopReading];
}

- (void)viewDidLoad {
    [super viewDidLoad];   
    
    // Initially make the captureSession object nil.
    _captureSession = nil;
    
    // Set the initial value of the flag to NO.
    _isReading = NO;

    
    _viewPreview = [[UIView alloc] init];
    [self.view addSubview:_viewPreview];
    
    [_viewPreview setTranslatesAutoresizingMaskIntoConstraints:NO];
    [self.view addConstraint:[NSLayoutConstraint constraintWithItem:_viewPreview
                                                          attribute:NSLayoutAttributeTop
                                                          relatedBy:NSLayoutRelationEqual
                                                             toItem:self.view
                                                          attribute:NSLayoutAttributeTop
                                                         multiplier:1.0
                                                           constant:0.0]];
    [self.view addConstraint:[NSLayoutConstraint constraintWithItem:_viewPreview
                                                          attribute:NSLayoutAttributeBottom
                                                          relatedBy:NSLayoutRelationEqual
                                                             toItem:self.view
                                                          attribute:NSLayoutAttributeBottom
                                                         multiplier:1.0
                                                           constant:0.0]];
    [self.view addConstraint:[NSLayoutConstraint constraintWithItem:_viewPreview
                                                          attribute:NSLayoutAttributeLeft
                                                          relatedBy:NSLayoutRelationEqual
                                                             toItem:self.view
                                                          attribute:NSLayoutAttributeLeft
                                                         multiplier:1.0
                                                           constant:0.0]];
    [self.view addConstraint:[NSLayoutConstraint constraintWithItem:_viewPreview
                                                          attribute:NSLayoutAttributeRight
                                                          relatedBy:NSLayoutRelationEqual
                                                             toItem:self.view
                                                          attribute:NSLayoutAttributeRight
                                                         multiplier:1.0
                                                           constant:0.0]];
    if (_needsScanAnnimation) {
        UIView * scanView = [[UIView alloc] init];
        [scanView setBackgroundColor:[UIColor colorWithWhite:0 alpha:0.0]];
        [self.view addSubview:scanView];
        [scanView setTranslatesAutoresizingMaskIntoConstraints:NO];
        
        [self.view addConstraint:[NSLayoutConstraint constraintWithItem:scanView
                                                              attribute:NSLayoutAttributeTop
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:_viewPreview
                                                              attribute:NSLayoutAttributeTop
                                                             multiplier:1.0
                                                               constant:0.0]];
        [self.view addConstraint:[NSLayoutConstraint constraintWithItem:scanView
                                                              attribute:NSLayoutAttributeBottom
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:_viewPreview
                                                              attribute:NSLayoutAttributeBottom
                                                             multiplier:1.0
                                                               constant:0.0]];
        [self.view addConstraint:[NSLayoutConstraint constraintWithItem:scanView
                                                              attribute:NSLayoutAttributeLeft
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:_viewPreview
                                                              attribute:NSLayoutAttributeLeft
                                                             multiplier:1.0
                                                               constant:0.0]];
        [self.view addConstraint:[NSLayoutConstraint constraintWithItem:scanView
                                                              attribute:NSLayoutAttributeRight
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:_viewPreview
                                                              attribute:NSLayoutAttributeRight
                                                             multiplier:1.0
                                                               constant:0.0]];
        
        CGFloat frameWidth = SCREEN_WIDTH * 2 / 3;
        
        //create path
        UIBezierPath *path = [UIBezierPath bezierPathWithRect:CGRectMake(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)];
        
        [path appendPath:[[UIBezierPath bezierPathWithRoundedRect:CGRectMake(SCREEN_WIDTH / 6, SCREEN_HEIGHT / 2 - SCREEN_WIDTH / 3, frameWidth, frameWidth) cornerRadius:0] bezierPathByReversingPath]];
        
        CAShapeLayer *shapeLayer = [CAShapeLayer layer];
        
        shapeLayer.path = path.CGPath;
        
        [scanView.layer setMask:shapeLayer];
        
        UIImageView * imageView = [[UIImageView alloc] init];
        [imageView setBackgroundColor:[UIColor clearColor]];
        [imageView setImage:_frameImage];
        [self.view addSubview:imageView];
        
        [imageView setTranslatesAutoresizingMaskIntoConstraints:NO];
        [self.view addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:[NSString stringWithFormat:@"V:[imageView(==%f)]", frameWidth]
                                                                          options:0
                                                                          metrics:0
                                                                            views:@{@"imageView":imageView}]];
        [self.view addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:[NSString stringWithFormat:@"H:[imageView(==%f)]", frameWidth]
                                                                          options:0
                                                                          metrics:0
                                                                            views:@{@"imageView":imageView}]];
        [self.view addConstraint:[NSLayoutConstraint constraintWithItem:imageView
                                                              attribute:NSLayoutAttributeCenterX
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:_viewPreview
                                                              attribute:NSLayoutAttributeCenterX
                                                             multiplier:1.0
                                                               constant:0.0]];
        [self.view addConstraint:[NSLayoutConstraint constraintWithItem:imageView
                                                              attribute:NSLayoutAttributeCenterY
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:_viewPreview
                                                              attribute:NSLayoutAttributeCenterY
                                                             multiplier:1.0
                                                               constant:0.0]];
        
        
        _lineImageView = [[UIImageView alloc] init];
        CGFloat lineHeight = frameWidth * _lineImage.size.height / _lineImage.size.width;
        _lineRect0 = CGRectMake(0, 0, frameWidth, lineHeight);
        _lineRect1 = CGRectMake(0, frameWidth - lineHeight, frameWidth, lineHeight);
        [_lineImageView setFrame:_lineRect0];
        [_lineImageView setImage:_lineImage];
   //     [imageView addSubview:_lineImageView];
        
        [self.view addSubview:self.topView];
        
        [self.view addSubview:self.CancelView];
        [self.view addSubview:self.TorchView];

    }
}

-(void) cancelAction : (UIButton *) sender{
    self.Cancelimage.image = [UIImage imageNamed:@"Cancel-Active.png"];
    self.CancelLabel.textColor = [UIColor colorWithRed:0/255.f green:174/255.f blue:239/255.f alpha:1.0f];
    if (_completion) {
        _completion(NO, nil);
    }
    [self dealWithResult:nil];
    [self cancel];
}


-(void) btnFlashOnClicked :(UIButton *) sender{
    AVCaptureDevice *flashLight = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    if ([flashLight isTorchAvailable] && [flashLight isTorchModeSupported:AVCaptureTorchModeOn])
    {
        BOOL success = [flashLight lockForConfiguration:nil];
        if (success)
        {
            if ([flashLight isTorchActive])
            {
     //           [btnFlash setTitle:@"TURN ON" forState:UIControlStateNormal];
                self.TorchImage.image = [UIImage imageNamed:@"Light-Default.png"];
                self.TorchLabel.textColor = [UIColor colorWithRed:189/255.f green:202/255.f blue:219/255.f alpha:1.0f];
                [flashLight setTorchMode:AVCaptureTorchModeOff];
            }
            else
            {
    //           [btnFlash setTitle:@"TURN OFF" forState:UIControlStateNormal];
                self.TorchImage.image = [UIImage imageNamed:@"Light-Active.png"];
                self.TorchLabel.textColor = [UIColor colorWithRed:0/255.f green:174/255.f blue:239/255.f alpha:1.0f];

                [flashLight setTorchMode:AVCaptureTorchModeOn];
            }
            [flashLight unlockForConfiguration];
        }
    }
}

- (void)cancel{
    [self dismissViewControllerAnimated:NO completion:NULL];
}

- (void)start {
    [self startReading];
}

- (void)stop {
    [self stopReading];
}

- (void)dealWithResult:(NSString *)result {
    
}

#pragma mark - Private method implementation

- (void)startReading {
    if (!_isReading) {
        NSError *error;
        
        // Get an instance of the AVCaptureDevice class to initialize a device object and provide the video
        // as the media type parameter.
        AVCaptureDevice *captureDevice = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
        
        // Get an instance of the AVCaptureDeviceInput class using the previous device object.
        AVCaptureDeviceInput *input = [AVCaptureDeviceInput deviceInputWithDevice:captureDevice error:&error];
        
        if (input) {
            // Initialize the captureSession object.
            _captureSession = [[AVCaptureSession alloc] init];
            // Set the input device on the capture session.
            [_captureSession addInput:input];
            
            
            // Initialize a AVCaptureMetadataOutput object and set it as the output device to the capture session.
            AVCaptureMetadataOutput *captureMetadataOutput = [[AVCaptureMetadataOutput alloc] init];
            [_captureSession addOutput:captureMetadataOutput];
            
            // Create a new serial dispatch queue.
            dispatch_queue_t dispatchQueue;
            dispatchQueue = dispatch_queue_create("myQueue", NULL);
            [captureMetadataOutput setMetadataObjectsDelegate:self queue:dispatchQueue];
            [captureMetadataOutput setMetadataObjectTypes:[NSArray arrayWithObject:AVMetadataObjectTypeQRCode]];
            
            // Initialize the video preview layer and add it as a sublayer to the viewPreview view's layer.
            _videoPreviewLayer = [[AVCaptureVideoPreviewLayer alloc] initWithSession:_captureSession];
            [_videoPreviewLayer setVideoGravity:AVLayerVideoGravityResizeAspectFill];
            [_videoPreviewLayer setFrame:_viewPreview.layer.bounds];
            [_viewPreview.layer addSublayer:_videoPreviewLayer];
            
            
            // Start video capture.
            [_captureSession startRunning];
            _isReading = !_isReading;
        } else {
            // If any error occurs, simply log the description of it and don't continue any more.
            NSLog(@"%@", [error localizedDescription]);
            return;
        }
    }
}


- (void)stopReading {
    if (_isReading) {
        // Stop video capture and make the capture session object nil.
        [_captureSession stopRunning];
        _captureSession = nil;
        
        // Remove the video preview layer from the viewPreview view's layer.
        [_videoPreviewLayer removeFromSuperlayer];
        _isReading = !_isReading;
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

#pragma mark - AVCaptureMetadataOutputObjectsDelegate method implementation

-(void)captureOutput:(AVCaptureOutput *)captureOutput didOutputMetadataObjects:(NSArray *)metadataObjects fromConnection:(AVCaptureConnection *)connection{
    
    // Check if the metadataObjects array is not nil and it contains at least one object.
    if (metadataObjects != nil && [metadataObjects count] > 0) {
        // Get the metadata object.
        AVMetadataMachineReadableCodeObject *metadataObj = [metadataObjects objectAtIndex:0];
        if ([[metadataObj type] isEqualToString:AVMetadataObjectTypeQRCode]) {
            // If the found metadata is equal to the QR code metadata then update the status label's text,
            // stop reading and change the bar button item's title and the flag's value.
            // Everything is done on the main thread.
            
            void(^block)() = ^(void) {
                [self stopReading];
                [self cancel];
                if (![metadataObj stringValue] || [[metadataObj stringValue] length] == 0) {
                    if (_completion) {
                        _completion(NO, nil);
                    }
                    [self dealWithResult:nil];
                } else {
                    if (_completion) {
                        _completion(YES, [metadataObj stringValue]);
                    }
                    [self dealWithResult:[metadataObj stringValue]];
                }
            };
            
            if ([NSThread isMainThread]) {
                block();
            } else {
                dispatch_sync(dispatch_get_main_queue(), ^{
                    block();
                });
            }
        }
    }
}

@end
