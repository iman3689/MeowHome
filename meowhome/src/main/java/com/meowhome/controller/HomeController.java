package com.meowhome.controller;

import com.meowhome.data.CatCatalog;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    private final CatCatalog catCatalog;

    public HomeController(CatCatalog catCatalog) {
        this.catCatalog = catCatalog;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("cats", catCatalog.findAll());
        return "index";
    }
}
