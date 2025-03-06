import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AudioModule, RecordingPresets } from "expo-audio";
import RecordingModule, {
  AudioRecorder,
  RecordingOptions,
} from "recording-module";
import { RecordIcon, StopRecordingIcon } from "@/lib/components/icons";
import { useTheme } from "../contexts/theme";
import { logError } from "@/lib/log";

export default function RecordAudioButton({
  ignoreInput,
  onStart,
  onEnd,
}: {
  ignoreInput?: boolean;
  onStart?: () => void;
  onEnd?: (uri?: string) => void;
}) {
  const theme = useTheme();
  const recordingRef = useRef<AudioRecorder | null>(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    return () => {
      recordingRef.current?.release();
      recordingRef.current = null;
    };
  }, []);

  const [permissionRequested, setPermissionRequested] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestPermission = () =>
    AudioModule.requestRecordingPermissionsAsync().then((status) => {
      setPermissionGranted(status.granted);

      return status.granted;
    });

  const startRecording = () => {
    if (endRecording()) {
      return;
    }

    // start new recording
    const record = async () => {
      if (!permissionGranted && !(await requestPermission())) {
        return;
      }

      const preset = RecordingPresets.HIGH_QUALITY;
      const options = {
        ...preset,
        android: {
          // this doesn't seem to do anything?
          ...preset.android,
          audioSource: "voice_communication",
        },
        // duplicated here since audio module seems to read this as a flat structure
        ...preset.android,
        audioSource: "voice_communication",
        numberOfChannels: 1,
      };

      const recorder = new RecordingModule.AudioRecorder(
        options as Partial<RecordingOptions>
      );

      recorder
        .prepareToRecordAsync()
        .then(() => {
          recorder.record();

          // recorder.recordForDuration() is undefined?
          // custom limiter:
          setTimeout(() => {
            if (recordingRef.current && recorder.isRecording) {
              endRecording();
            }
          }, 5000);
        })
        .catch(logError);

      recordingRef.current = recorder;

      setRecording(true);
    };

    record().catch(logError);
    onStart?.();
  };

  const endRecording = () => {
    if (recordingRef.current) {
      // stop recording and append to list
      const { uri } = recordingRef.current;

      if (recordingRef.current.isRecording) {
        recordingRef.current.stop().catch(logError);
      }

      recordingRef.current = null;
      setRecording(false);

      onEnd?.(uri != null ? "file://" + uri : undefined);

      return true;
    }

    return false;
  };

  return (
    <View
      style={[styles.recordButtonContainer, theme.styles.circleButton]}
      onLayout={() => {
        if (!permissionRequested) {
          setPermissionRequested(true);
          requestPermission().catch(logError);
        }
      }}
    >
      <Pressable
        style={styles.recordButtonPressable}
        android_ripple={theme.ripples.primaryButton}
        delayLongPress={100}
        disabled={ignoreInput}
        onLongPress={() => {
          if (!ignoreInput && !recordingRef.current) {
            startRecording();
          }
        }}
        onPressOut={() => {
          if (!ignoreInput) {
            // this will stop a recording started by long press
            // or start a new recording if there was no long press
            startRecording();
          }
        }}
      >
        {recording ? (
          <StopRecordingIcon size={48} color={theme.colors.primary.contrast} />
        ) : (
          <RecordIcon size={48} color={theme.colors.primary.contrast} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  recordButtonContainer: {
    borderRadius: "50%",
    overflow: "hidden",
    aspectRatio: 1,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  recordButtonPressable: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
