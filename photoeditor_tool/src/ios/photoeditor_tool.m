/********* photoeditor_tool.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import <UIKit/UIKit.h>
#import "TOCropViewController.h"

@interface photoeditor_tool : CDVPlugin <UIImagePickerControllerDelegate, UINavigationControllerDelegate,TOCropViewControllerDelegate> {
  // Member variables go here.

    CDVPluginResult* pluginResult ;
    NSString* photoPath ;
}
@property (nonatomic, assign) CGRect croppedFrame;
@property (nonatomic, assign) NSInteger angle;

- (void)takeCamera:(CDVInvokedUrlCommand*)command;
- (void)takeLibrary : (CDVInvokedUrlCommand*)command;

@end

NSString *g_CallbackId = @"";
photoeditor_tool* g_photoeditor = nil;

@implementation photoeditor_tool

- (void)takeCamera:(CDVInvokedUrlCommand*)command
{
    g_CallbackId =  command.callbackId;
    g_photoeditor = self;

    UIImagePickerController *picker = [[UIImagePickerController alloc] init];
    picker.delegate = self;
    picker.allowsEditing = NO;
    picker.sourceType = UIImagePickerControllerSourceTypeCamera;
    
    [self.viewController presentViewController:picker animated:YES completion:NULL];
    

}

- (void)takeLibrary:(CDVInvokedUrlCommand*)command
{
    g_CallbackId =  command.callbackId;
    g_photoeditor = self;
    
    pluginResult = nil;

    UIImagePickerController *picker = [[UIImagePickerController alloc] init];
    picker.delegate = self;
    picker.allowsEditing = NO;
    picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
     
    [self.viewController presentViewController:picker animated:YES completion:NULL];

}

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingImage:(UIImage *)image editingInfo:(NSDictionary *)editingInfo
{
    pluginResult = nil;
    TOCropViewController *cropController = [[TOCropViewController alloc] initWithCroppingStyle:TOCropViewCroppingStyleCircular image:image];
    cropController.delegate = self;   
    //If profile picture, push onto the same navigation stack
    [picker pushViewController:cropController animated:YES];

}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {

    [picker dismissViewControllerAnimated:YES completion:^{
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        [g_photoeditor.commandDelegate sendPluginResult:pluginResult callbackId:g_CallbackId];
    }];
}


#pragma mark - Cropper Delegate -
- (void)cropViewController:(TOCropViewController *)cropViewController didCropToImage:(UIImage *)image withRect:(CGRect)cropRect angle:(NSInteger)angle
{
    self.croppedFrame = cropRect;
    self.angle = angle;
    [self updateImageViewWithImage:image fromCropViewController:cropViewController];
}

- (void)cropViewController:(TOCropViewController *)cropViewController didCropToCircularImage:(UIImage *)image withRect:(CGRect)cropRect angle:(NSInteger)angle
{
    self.croppedFrame = cropRect;
    self.angle = angle;
    [self updateImageViewWithImage:image fromCropViewController:cropViewController];
}

- (void)updateImageViewWithImage:(UIImage *)image fromCropViewController:(TOCropViewController *)cropViewController
{
 //   self.myImageView.image = image;

    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    photoPath= [documentsDirectory stringByAppendingPathComponent:@"Photo.png"];
    NSData* data = UIImagePNGRepresentation(image);
    [data writeToFile:photoPath atomically:YES];


    
    [cropViewController dismissViewControllerAnimated:YES completion:^{
        [self getphotoPath];
    }];

}


#pragma mark - Image Layout -
- (void)getphotoPath
{
     if (photoPath != nil && [photoPath length] > 0) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:photoPath];
            [g_photoeditor.commandDelegate sendPluginResult:pluginResult callbackId:g_CallbackId];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
            [g_photoeditor.commandDelegate sendPluginResult:pluginResult callbackId:g_CallbackId];
        }
}





@end
