import {
  AnimatableValue,
  Easing,
  runOnJS,
  SharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export const fadeTimingConfig = {
  duration: 500,
  easing: Easing.inOut(Easing.quad),
};

export function flash<T extends AnimatableValue>(
  sharedValue: SharedValue<T>,
  to: T,
  final: T
) {
  sharedValue.value = withSequence(
    withTiming(to, fadeTimingConfig),
    withTiming(final, fadeTimingConfig)
  );
}

export function fadeTo<T extends AnimatableValue>(
  sharedValue: SharedValue<T>,
  final: T,
  callback?: (finished: boolean | undefined) => void
) {
  sharedValue.value = withTiming(final, fadeTimingConfig, (finished) => {
    if (callback) {
      runOnJS(callback)(finished);
    }
  });
}
