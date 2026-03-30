"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorDocumentController = void 0;
const common_1 = require("@nestjs/common");
const doctor_document_service_1 = require("./doctor-document.service");
const createDoctorDocumentDTO_1 = require("./DTOS/createDoctorDocumentDTO");
const updateDoctorDocumentDTO_1 = require("./DTOS/updateDoctorDocumentDTO");
let DoctorDocumentController = class DoctorDocumentController {
    doctorDocumentService;
    constructor(doctorDocumentService) {
        this.doctorDocumentService = doctorDocumentService;
    }
    findAll() {
        return this.doctorDocumentService.findAll();
    }
    findOne(id) {
        return this.doctorDocumentService.findOne(id);
    }
    create(dto) {
        return this.doctorDocumentService.create(dto);
    }
    update(id, dto) {
        return this.doctorDocumentService.update(id, dto);
    }
    remove(id) {
        return this.doctorDocumentService.remove(id);
    }
};
exports.DoctorDocumentController = DoctorDocumentController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DoctorDocumentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DoctorDocumentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createDoctorDocumentDTO_1.CreateDoctorDocumentDto]),
    __metadata("design:returntype", void 0)
], DoctorDocumentController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateDoctorDocumentDTO_1.UpdateDoctorDocumentDto]),
    __metadata("design:returntype", void 0)
], DoctorDocumentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DoctorDocumentController.prototype, "remove", null);
exports.DoctorDocumentController = DoctorDocumentController = __decorate([
    (0, common_1.Controller)('doctor-document'),
    __metadata("design:paramtypes", [doctor_document_service_1.DoctorDocumentService])
], DoctorDocumentController);
//# sourceMappingURL=doctor-document.controller.js.map