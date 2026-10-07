package com.meowhome.controller;

import com.meowhome.data.CatCatalog;
import com.meowhome.model.Cat;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class CatController {
    private final CatCatalog catCatalog;

    public CatController(CatCatalog catCatalog) {
        this.catCatalog = catCatalog;
    }

    @GetMapping("/cats")
    public String list(Model model) {
        model.addAttribute("cats", catCatalog.findAll());
        return "cats/list";
    }

    @GetMapping("/cats/{id}")
    public String detail(@PathVariable String id, Model model) {
        long catId;
        try {
            catId = Long.parseLong(id);
        } catch (NumberFormatException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cat not found");
        }
        Cat cat = catCatalog.findById(catId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cat not found"));
        model.addAttribute("cat", cat);
        model.addAttribute("relatedCats", catCatalog.findAll().stream()
                .filter(other -> other.id() != cat.id()).toList());
        return "cats/detail";
    }
}
