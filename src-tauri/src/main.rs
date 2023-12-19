// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{path::Path, fs::{self}};


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_json, save_json])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn load_json() -> String {
    let json_path = Path::new("todos.json");
    if !json_path.exists() {
        let template = r#"{
    "todos": [],
    "theme": "wintry"
}
        "#;
        fs::write(json_path, template).expect("cannot write json");
    }
    let file = fs::read_to_string(json_path).expect("cannot read file");
    // let json: serde_json::Value = serde_json::from_str(&file).expect("cannot convert to json");
    file
}

#[tauri:: command]
fn save_json(todos: String) {
    let json_path = Path::new("todos.json");
    fs::write(json_path, todos).expect("cannot write json");
}
