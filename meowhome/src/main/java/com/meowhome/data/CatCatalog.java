package com.meowhome.data;

import com.meowhome.model.Cat;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/** Immutable, in-memory sample data shared by all public pages. */
@Component
public class CatCatalog {
    private final List<Cat> cats = List.of(
            new Cat(1, "小橘", "約 2 歲", "男生", "台北市", "等待一個家",
                    "/images/cat-mikan.jpg", "橘色長毛貓抬頭望向窗邊的光線",
                    "喜歡曬太陽，也喜歡在你身旁安靜待著。給牠一點時間，就能看見牠溫柔的一面。",
                    List.of("溫和慢熟", "喜歡陪伴", "愛曬太陽"),
                    List.of(
                            "小橘曾在街角的屋簷下生活。每次有人靠近，牠都會先退後幾步，再偷偷觀察那份善意。",
                            "在穩定的照顧中，牠逐漸願意留下來。如今最喜歡的事，是趴在窗邊，偶爾抬頭看看陪在身旁的人。",
                            "我們希望牠未來的家，能給牠慢慢熟悉環境的時間，讓這份信任繼續長大。"),
                    List.of("示意：已完成絕育與基礎健康檢查。", "示意：日常食慾與活動狀況穩定。"),
                    List.of("準備安靜的休息角落，讓牠自行探索。", "用固定作息與耐心陪伴建立安全感。")),
            new Cat(2, "花花", "約 3 歲", "女生", "新北市", "休養中",
                    "/images/cat-sesame.jpg", "一隻橘色虎斑貓在戶外石板上自在休息",
                    "喜歡暖暖的角落和不被催促的日常。牠正在慢慢恢復，等待安心生活的下一步。",
                    List.of("安靜親人", "喜歡午睡", "需要耐心"),
                    List.of(
                            "花花的日常，曾是在社區裡尋找一個避雨的角落。牠並不吵鬧，只會安靜地等熟悉的人出現。",
                            "來到照護環境後，花花開始學會放鬆。牠喜歡伸伸懶腰，再把頭靠在暖暖的地方，睡上一個下午。",
                            "目前牠仍在休養中。我們希望先陪牠把身體照顧好，再為牠尋找可以長久依靠的家。"),
                    List.of("示意：已由獸醫評估，持續觀察恢復情況。", "示意：休養完成前不安排認養媒合。"),
                    List.of("維持安靜且穩定的環境。", "依獸醫建議安排照護與追蹤。")),
            new Cat(3, "米米", "約 1 歲", "女生", "台中市", "等待一個家",
                    "/images/cat-mochi.jpg", "棕色虎斑貓坐在明亮的階梯上看向鏡頭",
                    "對世界充滿好奇，也懂得享受安靜。希望下一段日常，有人陪牠一起探索。",
                    List.of("好奇活潑", "喜歡探索", "享受互動"),
                    List.of(
                            "第一次遇見米米時，牠正沿著巷口的階梯，小心翼翼地認識周圍的世界。",
                            "在照護者的陪伴下，牠慢慢展現出好奇的個性。新玩具、窗外的聲音，都能讓牠專注地看上好一會兒。",
                            "米米期待一個安全的室內空間，也期待願意每天留一點時間，陪牠玩耍與休息的人。"),
                    List.of("示意：已完成絕育與基礎健康檢查。", "示意：活動力良好，持續觀察日常狀況。"),
                    List.of("提供安全的探索空間與牢固的門窗防護。", "每天安排適量遊戲，並尊重牠的休息時間。"))
    );

    public List<Cat> findAll() {
        return cats;
    }

    public Optional<Cat> findById(long id) {
        return cats.stream().filter(cat -> cat.id() == id).findFirst();
    }
}
