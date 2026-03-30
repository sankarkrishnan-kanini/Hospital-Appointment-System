"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorDocumentModule = void 0;
const common_1 = require("@nestjs/common");
const doctor_document_controller_1 = require("./doctor-document.controller");
const doctor_document_service_1 = require("./doctor-document.service");
const prisma_module_1 = require("../prisma/prisma.module");
let DoctorDocumentModule = class DoctorDocumentModule {
};
exports.DoctorDocumentModule = DoctorDocumentModule;
exports.DoctorDocumentModule = DoctorDocumentModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [doctor_document_controller_1.DoctorDocumentController],
        providers: [doctor_document_service_1.DoctorDocumentService]
    })
], DoctorDocumentModule);
//# sourceMappingURL=doctor-document.module.js.map