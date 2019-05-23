/********* qrcode_tool.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import "DYQRCodeDecoderViewController.h"
#import "CustomQRCode.h"
#import <UIKit/UIKit.h>

@interface qrcode_tool : CDVPlugin <UINavigationControllerDelegate>{
  // Member variables go here.
    CDVPluginResult* pluginResult ;
    NSString* echo ;
}

- (void)getScanCode:(CDVInvokedUrlCommand*)command;
- (void)getQRCode : (CDVInvokedUrlCommand*)command;
@end

@implementation qrcode_tool

- (void)getScanCode:(CDVInvokedUrlCommand*)command
{
    echo = @"Plugin View";
    pluginResult = nil;

     DYQRCodeDecoderViewController *vc = [[DYQRCodeDecoderViewController alloc] initWithCompletion:^(BOOL succeeded, NSString *result) {
         if (succeeded) {
            // [_recognizeText setText:result];
             echo = result;
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
             [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
         } else {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
             [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
           //  [_recognizeText setText:@"failed"];
         }
     }];
    [self.viewController presentViewController:[[UINavigationController alloc] initWithRootViewController:vc] animated:YES completion:NULL];
}



- (void)getQRCode:(CDVInvokedUrlCommand*)command
{
    echo = @"Plugin View";
    pluginResult = nil;

    [self.commandDelegate runInBackground:^{
        
        NSString* qrcodeSTR = [command.arguments objectAtIndex:0];
        UIColor *customColor = [UIColor colorWithRed:255.f/255.f green:255.f/255.f blue:255.f/255.f alpha:1.f];
        UIImage *customQrcode = [CustomQRCode generateCustomQRCode:qrcodeSTR andSize:200.f andColor:customColor];
        
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *documentsDirectory = [paths objectAtIndex:0];
        NSString* path = [documentsDirectory stringByAppendingPathComponent:[NSString stringWithString: @"test.png"]];
        NSData* data = UIImagePNGRepresentation(customQrcode);
        [data writeToFile:path atomically:YES];
        
        if (path != nil && [path length] > 0) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:path];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];

}

@end
