export const currentLocationIcon = `
    <div style="
      position: relative;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <!-- Pulsing ring -->
      <div style="
        position: absolute;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: rgba(59, 130, 246, 0.2);
        animation: pulse-ring 2s ease-out infinite;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "></div>

      <!-- Outer white border -->
      <div style="
        position: absolute;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "></div>

      <!-- Inner blue dot -->
      <div style="
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #3b82f6;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "></div>
    </div>
  `;
