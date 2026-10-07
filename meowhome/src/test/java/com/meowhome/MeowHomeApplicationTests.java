package com.meowhome;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MeowHomeApplicationTests {
    @LocalServerPort
    private int port;

    private final HttpClient client = HttpClient.newHttpClient();

    @Test
    void homepageRendersAllSectionsAndLinksToSharedCatData() throws Exception {
        HttpResponse<String> response = get("/");
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).contains("公益", "我們正在做的事", "等待家的浪浪", "浪浪故事",
                "TNR 行動", "支持我們", "小橘", "花花", "米米",
                "href=\"/cats/1\"", "href=\"/cats/2\"", "href=\"/cats/3\"");
    }

    @Test
    void directoryRendersThreeCatsAndWorkingPageNavigation() throws Exception {
        HttpResponse<String> response = get("/cats");
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).contains("認識浪浪｜MeowHome", "小橘", "花花", "米米",
                "href=\"/cats/1\"", "href=\"/cats/2\"", "href=\"/cats/3\"", "href=\"/#tnr\"");
        assertThat(response.body()).doesNotContain("th:replace", "th:each", "th:text");
    }

    @Test
    void everyCatHasItsOwnRenderedDetailPage() throws Exception {
        for (Map.Entry<Integer, String> cat : Map.of(1, "小橘", 2, "花花", 3, "米米").entrySet()) {
            HttpResponse<String> response = get("/cats/" + cat.getKey());
            assertThat(response.statusCode()).isEqualTo(200);
            assertThat(response.body()).contains("<title>" + cat.getValue() + "｜MeowHome</title>",
                    "健康與照護", "適合牠的陪伴", "返回浪浪列表", "示意個案", "href=\"/cats\"");
            assertThat(response.body()).doesNotContain("th:replace", "th:text");
        }
    }

    @Test
    void missingAndInvalidIdsReturnFriendly404() throws Exception {
        for (String id : new String[] {"999", "-1", "abc", "999999999999999999999999"}) {
            HttpResponse<String> response = get("/cats/" + id);
            assertThat(response.statusCode()).isEqualTo(404);
            assertThat(response.body()).contains("找不到頁面", "返回浪浪列表");
        }
    }

    private HttpResponse<String> get(String path) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + path))
                        .header("Accept", "text/html").GET().build(),
                HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
    }
}
