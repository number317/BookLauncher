package com.booklauncher.dto;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public class Book {
    String name;
    String path;
    String type;
    String cover;
    Boolean coverReady;

    public Book(String name, String path, String type, String cover, Boolean coverReady) {
        this.name = name;
        this.path = path;
        this.type = type;
        this.cover = cover;
        this.coverReady = coverReady;
    }

    public String getName() {
        return name;
    }

    public String getPath() {
        return path;
    }

    public String getType() {
        return type;
    }

    public String getCover() {
        return cover;
    }

    public Boolean getCoverReady() {
        return coverReady;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public void setCoverReady(Boolean coverReady) {
        this.coverReady = coverReady;
    }

    public WritableMap toWritableMap() {
        WritableMap data = Arguments.createMap();
        data.putString("name", name);
        data.putString("path", path);
        data.putString("type", type);
        data.putString("cover", cover);
        data.putBoolean("coverReady", coverReady);
        return data;
    }
}