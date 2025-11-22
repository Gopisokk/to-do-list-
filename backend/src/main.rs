use actix_cors::Cors;
use actix_web::{delete, get, post, put, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
struct TodoItem {
    id: String,
    title: String,
    completed: bool,
}

#[derive(Deserialize)]
struct CreateTodo {
    title: String,
}

struct AppState {
    todos: Mutex<Vec<TodoItem>>,
}

#[get("/todos")]
async fn get_todos(data: web::Data<AppState>) -> impl Responder {
    let todos = data.todos.lock().unwrap();
    HttpResponse::Ok().json(&*todos)
}

#[post("/todos")]
async fn create_todo(data: web::Data<AppState>, req: web::Json<CreateTodo>) -> impl Responder {
    let mut todos = data.todos.lock().unwrap();
    let new_todo = TodoItem {
        id: Uuid::new_v4().to_string(),
        title: req.title.clone(),
        completed: false,
    };
    todos.push(new_todo.clone());
    HttpResponse::Ok().json(new_todo)
}

#[put("/todos/{id}")]
async fn toggle_todo(data: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let mut todos = data.todos.lock().unwrap();
    let id = path.into_inner();
    
    if let Some(todo) = todos.iter_mut().find(|t| t.id == id) {
        todo.completed = !todo.completed;
        HttpResponse::Ok().json(todo)
    } else {
        HttpResponse::NotFound().finish()
    }
}

#[delete("/todos/{id}")]
async fn delete_todo(data: web::Data<AppState>, path: web::Path<String>) -> impl Responder {
    let mut todos = data.todos.lock().unwrap();
    let id = path.into_inner();
    
    let initial_len = todos.len();
    todos.retain(|t| t.id != id);
    
    if todos.len() < initial_len {
        HttpResponse::Ok().finish()
    } else {
        HttpResponse::NotFound().finish()
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState {
        todos: Mutex::new(Vec::new()),
    });

    println!("Server running at http://127.0.0.1:8080");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .app_data(app_state.clone())
            .service(get_todos)
            .service(create_todo)
            .service(toggle_todo)
            .service(delete_todo)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
