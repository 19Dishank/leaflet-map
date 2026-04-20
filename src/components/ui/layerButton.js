export const layerButton = `
      <div class="ls-btn" id="ls-toggle-btn">
        <div class="ls-btn-preview ls-preview-street"></div>
        <div class="ls-btn-label">Layers</div>
      </div>

      <div class="ls-panel" id="ls-panel">
        <div class="ls-panel-close" id="ls-close">✕</div>
        <div class="ls-panel-title">Map type</div>
        <div class="ls-options">

          <div class="ls-option active" data-layer="street">
            <div class="ls-thumb ls-thumb-street">
              <div class="ls-check">
                <svg viewBox="0 0 10 10" fill="none" width="9" height="9">
                  <polyline points="2,5 4,7 8,3" stroke="white" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <span class="ls-name">Street</span>
          </div>

          <div class="ls-option" data-layer="satellite">
            <div class="ls-thumb ls-thumb-satellite">
              <div class="ls-check">
                <svg viewBox="0 0 10 10" fill="none" width="9" height="9">
                  <polyline points="2,5 4,7 8,3" stroke="white" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <span class="ls-name">Satellite</span>
          </div>

          <div class="ls-option " data-layer="world">
            <div class="ls-thumb ls-thumb-world">
              <div class="ls-check">
                <svg viewBox="0 0 10 10" fill="none" width="9" height="9">
                  <polyline points="2,5 4,7 8,3" stroke="white" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <span class="ls-name">World Street</span>
          </div>

        </div>
      </div>
    `;
