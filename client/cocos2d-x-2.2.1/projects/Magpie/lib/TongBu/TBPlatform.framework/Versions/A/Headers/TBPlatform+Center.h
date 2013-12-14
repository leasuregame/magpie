//
//  TBPlatform+Center.h
//  TBPlatform
//
//  Created by OXH on 13-4-26.
//
//

#import "TBPlatform.h"

@interface TBPlatform (Center)



#pragma mark - Center

/**
 *	@brief	进入用户中心
 *
 *	@param 	nFlag 	预留，默认为0
 */
- (void)TBEnterUserCenter:(int)nFlag;


/**
 @brief 进入游戏大厅
 @param nFlag 预留，默认为0。
 */
- (void)TBEnterAppCenter:(int) nFlag;


/**
 @brief 进入应用论坛 （论坛需要找同步商务配置，具体联系接入专员）
 @param nFlag 预留，目前传0即可
 @result 错误码
 */
- (int)TBEnterAppBBS:(int)nFlag;



@end