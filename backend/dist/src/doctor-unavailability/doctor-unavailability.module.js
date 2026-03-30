"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorUnavailabilityModule = void 0;
const common_1 = require("@nestjs/common");
const doctor_unavailability_controller_1 = require("./doctor-unavailability.controller");
const doctor_unavailability_service_1 = require("./doctor-unavailability.service");
const prisma_module_1 = require("../prisma/prisma.module");
let DoctorUnavailabilityModule = class DoctorUnavailabilityModule {
};
exports.DoctorUnavailabilityModule = DoctorUnavailabilityModule;
exports.DoctorUnavailabilityModule = DoctorUnavailabilityModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [doctor_unavailability_controller_1.DoctorUnavailabilityController],
        providers: [doctor_unavailability_service_1.DoctorUnavailabilityService]
    })
], DoctorUnavailabilityModule);
//# sourceMappingURL=doctor-unavailability.module.js.map