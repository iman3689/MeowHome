# MeowHome

台灣流浪貓公益網站第一階段前台：首頁、浪浪列表與個別故事。

## 啟動

需要 JDK 25。使用內附 Maven Wrapper，不需另裝 Maven；首次執行需連網下載工具與相依套件。

在 PowerShell 執行：

```powershell
cd G:\Web_Cat\meowhome
.\mvnw.cmd spring-boot:run
```

開啟 http://localhost:8080。前景執行時按 Ctrl+C 停止；若已有背景網站，請先停止其程序以釋放 8080。

驗證與建置：

```powershell
.\mvnw.cmd verify
```

## 前台頁面

| 路由 | 用途 |
| --- | --- |
| `/` | 公益成果、行動方向、等待家的浪浪、故事、TNR、支持資訊 |
| `/cats` | 顯示小橘、花花、米米三筆假資料與詳細頁連結 |
| `/cats/1` | 小橘的基本資料、個性、故事與照護資訊 |
| `/cats/2` | 花花的基本資料、個性、故事與照護資訊 |
| `/cats/3` | 米米的基本資料、個性、故事與照護資訊 |

`/cats/{id}` 會依 ID 選取假資料；不存在或無法解析的 ID 回傳 HTTP 404 並顯示返回列表的頁面。Header 與 Footer 可在所有頁面連到列表或首頁區塊。

## 專案結構

- `pom.xml`：Java、Spring Boot 與 Maven 相依套件。
- `mvnw`、`mvnw.cmd`、`.mvn/wrapper/maven-wrapper.properties`：Maven Wrapper。
- `src/main/java/com/meowhome/MeowHomeApplication.java`：啟動入口。
- `controller/HomeController.java`：將首頁所需的浪浪假資料放入 Model。
- `controller/CatController.java`：列表、詳細頁與無效 ID 處理。
- `model/Cat.java`：純展示用 Java record，不是 JPA Entity。
- `data/CatCatalog.java`：不可變的記憶體 List，集中存放三筆假資料。
- `src/main/resources/templates/index.html`：首頁完整公益區塊。
- `templates/cats/list.html`：浪浪列表。
- `templates/cats/detail.html`：個別浪浪故事。
- `templates/fragments/layout.html`：共用 head、Header 與 Footer。
- `templates/fragments/cat-profile.html`：共用浪浪照片與基本資料。
- `templates/error/404.html`：找不到頁面的前台畫面。
- `static/css/style.css`：既有色彩 tokens、首頁與其他頁面的響應式版面。
- `static/js/home.js`：所有頁面共用的手機選單操作。
- `static/images/`：本地真實貓咪攝影，來源列於頁尾。
- `application.properties`：網站名稱、連接埠與資料庫停用設定。
- `src/test/java/com/meowhome/MeowHomeApplicationTests.java`：透過實際 HTTP 驗證首頁、列表、三個詳細頁與無效 ID。

Java 子目錄相對於 `src/main/java/com/meowhome/`；模板與靜態檔子目錄相對於 `src/main/resources/`。

## 第一階段範圍

保留原有 Spring MVC、Thymeleaf 與 Maven 架構。JPA 與 PostgreSQL Driver 相依套件保留，但 DataSource、Hibernate JPA 與 JPA Repository 自動設定仍停用。未接資料庫、未建立 Entity、Repository、資料表或初始化 SQL。

三筆個案、照護資訊、浪浪故事與公益成果均為示意資料，不代表真實送養或救援紀錄。未建立登入、會員、認養申請表或金流；支持及志工區塊提供籌備說明。

後續加入資料庫時，再移除 `spring.autoconfigure.exclude` 並設定 PostgreSQL 連線；目前 `ddl-auto=none` 禁止自動建立資料表。
