package net.zorphy.backend.site.risk;

import jakarta.validation.Valid;
import net.zorphy.backend.site.risk.dto.SimulationConfig;
import net.zorphy.backend.site.risk.service.RiskService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/risk")
public class RiskController {
    private final RiskService riskService;

    public RiskController(RiskService riskService) {
        this.riskService = riskService;
    }

    @PostMapping("simulation")
    public Object simulate(@RequestBody @Valid SimulationConfig simulationConfig) {
        return riskService.simulate(simulationConfig);
    }
}
