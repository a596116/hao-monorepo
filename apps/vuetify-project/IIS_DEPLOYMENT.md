# IIS 部署指南

# 前置需求

在 IIS 上部署此應用前，需要安裝以下 IIS 模組：

## 1. URL Rewrite Module

- 下載：https://www.iis.net/downloads/microsoft/url-rewrite
- 用於處理 SPA 路由和反向代理

## 2. Application Request Routing (ARR) - 反向代理必需

- **重要**：如果要使用 `web.config` 中的反向代理功能，必須安裝 ARR
- 下載：https://www.iis.net/downloads/microsoft/application-request-routing
- 安裝後需要啟用代理功能：
  1. 在 IIS 管理員中選擇伺服器節點
  2. 雙擊「Application Request Routing Cache」
  3. 在右側點擊「Server Proxy Settings」
  4. 勾選「Enable proxy」
  5. 點擊「Apply」

# 部署步驟

## 1. 建置專案

```bash
pnpm build
```

建置完成後，產生的檔案會在 `dist` 目錄中。

## 2. 修改 web.config 中的 API URL

編輯 `web.config` 檔案，將 API 反向代理規則中的目標 URL 修改為您的實際 API 伺服器地址。

**重要：** 如果您的 API 伺服器使用 HTTPS，請將 `http://` 改為 `https://`。

完整的 `web.config` 內容如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <!-- 處理 SPA 路由和 API 反向代理 -->
    <rewrite>
      <rules>
        <!-- API 反向代理規則 -->
        <!-- 注意：此規則需要 Application Request Routing (ARR) 模組才能進行反向代理 -->
        <!-- 如果沒有安裝 ARR，請考慮使用其他方式（如 nginx 或直接在後端處理 CORS） -->
        <rule name="API Proxy" stopProcessing="true">
          <match url="^api/ALS/Web(.*)$" />
          <!-- 將 localhost:8080 改為您的實際 API 伺服器地址 -->
          <!-- 如果使用 HTTPS，請將 http:// 改為 https:// -->
          <!-- 保留完整路徑 /api/ALS/Web，不移除前綴 -->
          <!-- 注意：使用 Proxy 類型需要 ARR 模組，如果無法使用 Proxy，可改用 Rewrite -->
          <action type="Proxy" url="http://localhost:8080/api/ALS/Web{R:1}" />
          <serverVariables>
            <set name="HTTP_X_FORWARDED_HOST" value="{HTTP_HOST}" />
            <!-- 設定協議：{HTTPS} 的值為 on/off，某些後端可能需要 http/https 字串 -->
            <!-- 如果後端需要明確的 http/https 字串，可以使用條件規則來轉換 -->
            <set name="HTTP_X_FORWARDED_PROTO" value="{HTTPS}" />
            <set name="HTTP_X_FORWARDED_FOR" value="{REMOTE_ADDR}" />
          </serverVariables>
        </rule>

        <!-- SPA 路由規則 - 處理所有非檔案請求 -->
        <!-- 將所有非 API 且非實際檔案的請求重寫到 index.html -->
        <rule name="SPA Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/api/" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
      <!-- 允許 serverVariables 設定（需要管理員權限或修改 applicationHost.config） -->
      <allowedServerVariables>
        <add name="HTTP_X_FORWARDED_HOST" />
        <add name="HTTP_X_FORWARDED_PROTO" />
        <add name="HTTP_X_FORWARDED_FOR" />
      </allowedServerVariables>
    </rewrite>

    <!-- 設定預設文件 -->
    <defaultDocument>
      <files>
        <clear />
        <add value="index.html" />
      </files>
    </defaultDocument>

    <!-- 設定靜態檔案快取 -->
    <!-- 注意：建議為不同類型的檔案設定不同的快取時間 -->
    <!-- HTML 檔案不應快取太久，而 CSS/JS/圖片等可以快取較長時間 -->
    <staticContent>
      <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="365.00:00:00" />
    </staticContent>
    <!-- 針對 HTML 檔案設定較短的快取時間 -->
    <location path="index.html">
      <system.webServer>
        <staticContent>
          <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="0.00:00:00" />
        </staticContent>
      </system.webServer>
    </location>

    <!-- 設定 MIME 類型 -->
    <httpProtocol>
      <customHeaders>
        <remove name="X-Powered-By" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>
```

**修改重點：**

- 第 15 行：將 `http://localhost:8080` 改為您的實際 API 伺服器地址
- 如果使用 HTTPS，將 `http://` 改為 `https://`
- **注意**：如果使用 `action type="Proxy"` 遇到問題，可以改回 `action type="Rewrite"`，但需要確保 ARR 已正確安裝並啟用代理功能

## 3. 部署到 IIS

1. 將 `dist` 目錄中的所有檔案複製到 IIS 網站目錄
2. 將 `web.config` 檔案也複製到 IIS 網站根目錄（與 `index.html` 同一層）
3. 在 IIS 管理員中設定網站：
   - 應用程式集區：建立新的應用程式集區，設定為「無受控碼」（No Managed Code），因為這是純前端應用
   - 網站綁定：設定適當的端口和主機名稱

## 4. 啟用 serverVariables（反向代理需要）

為了讓反向代理正常工作，需要允許 `web.config` 中設定的 serverVariables：

**方法一：使用 IIS 管理員（推薦）**

1. 在 IIS 管理員中選擇網站
2. 雙擊「URL Rewrite」
3. 在右側點擊「View Server Variables」
4. 點擊「Add...」並添加以下變數：
   - `HTTP_X_FORWARDED_HOST`
   - `HTTP_X_FORWARDED_PROTO`
   - `HTTP_X_FORWARDED_FOR`
5. 點擊「Apply」

**方法二：手動編輯 applicationHost.config**

1. 以管理員身份開啟文字編輯器
2. 開啟 `C:\Windows\System32\inetsrv\config\applicationHost.config`
3. 找到您的網站配置區段
4. 在 `<rewrite>` 區段中添加 `<allowedServerVariables>`（如果 `web.config` 中已包含，此步驟可省略）

## 5. 設定應用程式集區

建議設定：

- **.NET CLR 版本**：無受控碼（因為這是純前端應用）
- **受控管線模式**：整合式

## 6. 設定權限

確保 IIS_IUSRS 帳戶對網站目錄有讀取權限。

# 環境變數配置

## 開發環境

在 `.env` 檔案中設定：

```
VITE_API_URL=http://localhost:8080
```

## 生產環境

在 `web.config` 中直接修改反向代理的目標 URL。

# 反向代理說明

`web.config` 中的反向代理規則會：

1. 攔截所有以 `/api/ALS/Web` 開頭的請求
2. 將請求轉發到後端 API 伺服器（在 `web.config` 中設定的 URL）
3. **保留完整路徑** `/api/ALS/Web` 前綴後再轉發

例如：

- 前端請求：`/api/ALS/Web/users`
- 實際轉發到：`http://your-api-server:8080/api/ALS/Web/users`

**注意**：此配置保留完整路徑，因為後端 API 需要完整的 `/api/ALS/Web` 路徑。

# 替代方案：不使用反向代理

如果您不想安裝 ARR 或無法使用反向代理，可以考慮以下方案：

## 方案一：後端配置 CORS

1. 在後端 API 伺服器上配置 CORS，允許前端域名訪問
2. 修改 `src/utils/useHttp.ts`，將 `baseURL` 改為完整的 API URL：
   ```typescript
   baseURL: "http://your-api-server:8080"
   ```
3. 移除 `web.config` 中的 API 反向代理規則

## 方案二：使用環境變數

1. 在生產環境建置時設定環境變數：
   ```bash
   VITE_API_URL=http://your-api-server:8080 pnpm build
   ```
2. 修改 `src/utils/useHttp.ts` 使用環境變數：
   ```typescript
   baseURL: import.meta.env.VITE_API_URL || "/api/ALS/Web"
   ```

# 常見問題

## Q: 如何確認 URL Rewrite Module 已安裝？

A: 在 IIS 管理員中，選擇網站，如果看到「URL Rewrite」圖示，表示已安裝。

## Q: 如何確認 ARR 已安裝並啟用？

A: 在 IIS 管理員中，選擇伺服器節點，如果看到「Application Request Routing Cache」圖示，表示已安裝。點擊後查看「Server Proxy Settings」確認代理功能已啟用。

## Q: API 請求返回 502 錯誤？

A: 檢查：

1. `web.config` 中的 API URL 是否正確
2. 後端 API 伺服器是否正常運行
3. IIS 伺服器是否能訪問後端 API 伺服器（網路連線、防火牆設定）
4. ARR 代理功能是否已啟用
5. serverVariables 是否已正確設定
6. 如果使用 `action type="Proxy"`，確認 ARR 已安裝；如果使用 `action type="Rewrite"`，確認 URL Rewrite Module 已安裝

## Q: 頁面重新整理後出現 404？

A: 確認 `web.config` 中的 SPA 路由規則已正確設定，並且 URL Rewrite Module 已安裝。

## Q: 如何處理 HTTPS？

A: 如果您的網站使用 HTTPS，`web.config` 中的 `HTTP_X_FORWARDED_PROTO` 會根據 `{HTTPS}` 變數設定（值為 `on` 或 `off`）。如果 API 也使用 HTTPS，請將 `web.config` 中的 `http://` 改為 `https://`。注意：某些後端可能需要明確的 `http` 或 `https` 字串值，而非 `on`/`off`，此時可能需要使用條件規則來正確設定。

## Q: serverVariables 設定後仍無法使用？

A: 確保：

1. 已以管理員身份操作 IIS
2. 在網站層級或伺服器層級正確設定了 allowedServerVariables
3. 重新啟動 IIS 或應用程式集區
