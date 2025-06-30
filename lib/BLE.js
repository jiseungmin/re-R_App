import { BleManager } from 'react-native-ble-plx';

// 앱 전체에서 사용할 단일 BleManager 인스턴스
export const bleManager = new BleManager();

// BleManager 상태 관리를 위한 유틸리티 함수들
export const BLEUtils = {
  // BleManager가 초기화되었는지 확인
  isInitialized: () => {
    return bleManager !== null;
  },

  // BleManager 정리 (앱 종료 시에만 호출)
  destroy: () => {
    if (bleManager) {
      bleManager.destroy();
    }
  },

  // 스캔 중지
  stopScan: () => {
    if (bleManager) {
      bleManager.stopDeviceScan();
    }
  },

  // 모든 연결 해제
  disconnectAll: async () => {
    if (bleManager) {
      const connectedDevices = await bleManager.connectedDevices([]);
      for (const device of connectedDevices) {
        try {
          await device.cancelConnection();
        } catch (error) {
          console.log('연결 해제 중 오류:', error);
        }
      }
    }
  }
}; 