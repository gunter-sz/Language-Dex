import {
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
  RequestPurchase,
  requestPurchase,
  getProducts,
  ErrorCode,
} from "react-native-iap";
import { logError } from "./log";
import { SetUserDataCallback } from "./contexts/user-data";
import { UserData } from "./data";

const ignoredErrors = [ErrorCode.E_USER_CANCELLED, ErrorCode.E_NETWORK_ERROR];

export async function initInAppPurchases(
  userData: UserData,
  setUserData: SetUserDataCallback
) {
  await initConnection();
  await flushFailedPurchasesCachedAsPendingAndroid().catch(() => {
    // exception can happen here if:
    // - there are pending purchases that are still pending (we can't consume a pending purchase)
    // in any case, you might not want to do anything special with the error
  });
  await restorePurchases(userData, setUserData).catch(() => logError);

  purchaseUpdatedListener((purchase) => {
    const receipt = purchase.transactionReceipt;

    if (receipt) {
      finishTransaction({ purchase, isConsumable: false })
        .then(() =>
          setUserData((userData) => ({ ...userData, removeAds: true }))
        )
        .catch(logError);
    }
  });

  purchaseErrorListener((err) => {
    if (err.code == undefined || !ignoredErrors.includes(err.code)) {
      logError(err);
    }
  });

  await getProducts({ skus: ["remove_ads"] });
}

export async function requestAdRemoval() {
  const purchaseParams: RequestPurchase = {
    skus: ["remove_ads"],
    andDangerouslyFinishTransactionAutomaticallyIOS: false,
  };

  requestPurchase(purchaseParams).catch(() => {});
}

async function restorePurchases(
  userData: UserData,
  setUserData: SetUserDataCallback
) {
  if (userData.removeAds) {
    return;
  }

  const purchases = await getAvailablePurchases();

  if (purchases.length > 0) {
    setUserData({ ...userData, removeAds: true });
  }
}
