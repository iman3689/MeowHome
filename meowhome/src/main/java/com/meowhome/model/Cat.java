package com.meowhome.model;

import java.util.List;

/** Display data only; this record is not a JPA entity. */
public record Cat(
        long id,
        String name,
        String age,
        String gender,
        String location,
        String status,
        String imagePath,
        String imageAlt,
        String introduction,
        List<String> personality,
        List<String> story,
        List<String> healthNotes,
        List<String> careNotes) {
}
