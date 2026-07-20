package com.gestaotarefas.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import java.util.List;

@RestController
@RequestMapping("/tarefas")
@CrossOrigin(origins = "http://localhost:5173")
public class TarefaController {

    private final TarefaRepository tarefaRepository;

    public TarefaController(TarefaRepository tarefaRepository) {
        this.tarefaRepository = tarefaRepository;
    }

    @GetMapping
    public List<Tarefa> listarTodas() {
        return tarefaRepository.findAll();
    }

    @PostMapping
    public Tarefa criar(@RequestBody Tarefa tarefa) {
        return tarefaRepository.save(tarefa);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
    tarefaRepository.deleteById(id);
}

@PutMapping("/{id}/alternar")
public Tarefa alternarConclusao(@PathVariable Long id) {
    Tarefa tarefa = tarefaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        tarefa.setConcluida(!tarefa.isConcluida()); 
    
    return tarefaRepository.save(tarefa);
}
}
