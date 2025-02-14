import {
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
  RequestPurchase,
  requestPurchase,
} from "react-native-iap";
import { logError } from "./log";
import { SetUserDataCallback } from "./contexts/user-data";
import { UserData } from "./data";

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
  await restorePurchases(userData, setUserData).catch(logError);

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

  purchaseErrorListener(logError);
}

export async function requestAdRemoval() {
  const purchaseParams: RequestPurchase = {
    skus: [""],
    andDangerouslyFinishTransactionAutomaticallyIOS: false,
  };

  requestPurchase(purchaseParams).catch(logError);
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
