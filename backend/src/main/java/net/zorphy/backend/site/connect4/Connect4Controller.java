package net.zorphy.backend.site.connect4;

import net.zorphy.backend.site.connect4.dto.request.MoveRequest;
import net.zorphy.backend.site.connect4.dto.request.SolveRequest;
import net.zorphy.backend.site.connect4.dto.request.UndoRequest;
import net.zorphy.backend.site.connect4.dto.response.MoveResponse;
import net.zorphy.backend.site.connect4.dto.response.SolveResponse;
import net.zorphy.backend.site.connect4.service.Connect4Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.invoke.MethodHandles;

@RestController
@RequestMapping("/connect4")
public class Connect4Controller {
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final Connect4Service connect4Service;

    public Connect4Controller(Connect4Service connect4Service) {
        this.connect4Service = connect4Service;
    }

    @PostMapping("solve")
    public SolveResponse solve(@RequestBody SolveRequest solveRequest) {
        LOGGER.info("POST /connect4/solve");

        return connect4Service.makeBestMove(solveRequest);
    }

    @PostMapping("move")
    public MoveResponse move(@RequestBody MoveRequest moveRequest) {
        LOGGER.info("POST /connect4/move");

        return connect4Service.makeMove(moveRequest);
    }

    @PostMapping("undo")
    public MoveResponse undo(@RequestBody UndoRequest undoRequest) {
        LOGGER.info("POST /connect4/undo");

        return connect4Service.undoMove(undoRequest);
    }
}
