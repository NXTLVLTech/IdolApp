//
//  DYQRCodeDecoderViewController.h
//  QRCode-Decoder
//
//  Created by Dwarven on 16/7/5.
//  Copyright © 2016 Dwarven. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface DYQRCodeDecoderViewController : UIViewController


@property (nonatomic, strong, readonly) UIButton *CancelBtn;
@property (nonatomic, strong, readonly) UIButton *TorchBtn;
@property (nonatomic, strong, readonly) UIView  *CancelView;
@property (nonatomic, strong, readonly) UIImageView  *Cancelimage;
@property (nonatomic, strong, readonly) UILabel  *CancelLabel;
@property (nonatomic, strong, readonly) UIView  *TorchView;
@property (nonatomic, strong, readonly) UIImageView  *TorchImage;
@property (nonatomic, strong, readonly) UILabel  *TorchLabel;

@property (nonatomic, strong, readonly) UIView  *topView;
@property (nonatomic, strong, readonly) UILabel *scanTitle;

@property (nonatomic, strong) UIImage * frameImage;
@property (nonatomic, strong) UIImage * lineImage;
@property (nonatomic) BOOL needsScanAnnimation;

- (id)initWithCompletion:(void(^)(BOOL succeeded, NSString * result))completion;

#pragma mark - methods for subclass

- (void)start;
- (void)stop;
- (void)dealWithResult:(NSString *)result;
- (void)cancel;

@end
