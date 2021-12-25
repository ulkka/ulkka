#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Firebase.h>
#import <AVFoundation/AVFoundation.h>
#import "RNFBMessagingModule.h"
#import <RNShareMenu/ShareMenuManager.h>
#import <React/RCTLinkingManager.h>
#import <RNCPushNotificationIOS.h>
#import <UserNotifications/UserNotifications.h>

#ifdef FB_SONARKIT_ENABLED 
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

#if RCT_DEV
#import <React/RCTDevLoadingView.h>
#endif

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  if([FIRApp defaultApp]==nil){
     [FIRApp configure];
  }
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif
[[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error: nil]; //OPTIONAL: Activated sound when iPhone (iOS) is on vibrate mode react-native-youtube

NSURL *jsCodeLocation; 
jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
 
RCTBridge *bridge = [[RCTBridge alloc] initWithBundleURL:jsCodeLocation
                                            moduleProvider:nil
                                            launchOptions:launchOptions];
#if RCT_DEV
  [bridge moduleForClass:[RCTDevLoadingView class]];
#endif                        

// in "(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions" method
// Use `addCustomPropsToUserProps` to pass in props for initialization of your app
// Or pass in `nil` if you have none as per below example
// For `withLaunchOptions` please pass in `launchOptions` object
NSDictionary *appProperties = [RNFBMessagingModule addCustomPropsToUserProps:nil withLaunchOptions:launchOptions];

RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Omong"
                                                   initialProperties:appProperties];

   if (@available(iOS 13.0, *)) {
        rootView.backgroundColor = [UIColor systemBackgroundColor];
	  } else {
	      rootView.backgroundColor = [UIColor whiteColor];
	  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // Define UNUserNotificationCenter
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  //  Check if the passed url is a omongshare://- or a Deeplink
  NSString *urlString = url.absoluteString;

  //  If it contains omongshare:// handle it with the ShareMenuManager
  if ([urlString hasPrefix:@"omongshare://"]) {
    return [ShareMenuManager application:application openURL:url options:options];
  }
  //  Else handle with deeplink contains omong:// handle it with the RCTLinkingManager
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}

// Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center
      willPresentNotification:(UNNotification *)notification
        withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  // Still call the JS onNotification handler so it can display the new message right away
  NSDictionary *userInfo = notification.request.content.userInfo;
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo
                                fetchCompletionHandler:^void (UIBackgroundFetchResult result){}];

  // allow showing foreground notifications
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
  // or if you wish to hide all notification while in foreground replace it with 
  // completionHandler(UNNotificationPresentationOptionNone);
}

@end


