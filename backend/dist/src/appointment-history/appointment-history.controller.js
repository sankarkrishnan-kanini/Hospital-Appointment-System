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
exports.AppointmentHistoryController = void 0;
const common_1 = require("@nestjs/common");
const appointment_history_service_1 = require("./appointment-history.service");
const createAppointmentHistoryDTO_1 = require("./DTOS/createAppointmentHistoryDTO");
const updateAppointmentHistoryDTO_1 = require("./DTOS/updateAppointmentHistoryDTO");
let AppointmentHistoryController = class AppointmentHistoryController {
    appointmentHistoryService;
    constructor(appointmentHistoryService) {
        this.appointmentHistoryService = appointmentHistoryService;
    }
    findAll() {
        return this.appointmentHistoryService.findAll();
    }
    findOne(id) {
        return this.appointmentHistoryService.findOne(id);
    }
    create(dto) {
        return this.appointmentHistoryService.create(dto);
    }
    update(id, dto) {
        return this.appointmentHistoryService.update(id, dto);
    }
    remove(id) {
        return this.appointmentHistoryService.remove(id);
    }
};
exports.AppointmentHistoryController = AppointmentHistoryController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppointmentHistoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AppointmentHistoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createAppointmentHistoryDTO_1.CreateAppointmentHistoryDto]),
    __metadata("design:returntype", void 0)
], AppointmentHistoryController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateAppointmentHistoryDTO_1.UpdateAppointmentHistoryDto]),
    __metadata("design:returntype", void 0)
], AppointmentHistoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AppointmentHistoryController.prototype, "remove", null);
exports.AppointmentHistoryController = AppointmentHistoryController = __decorate([
    (0, common_1.Controller)('appointment-history'),
    __metadata("design:paramtypes", [appointment_history_service_1.AppointmentHistoryService])
], AppointmentHistoryController);
//# sourceMappingURL=appointment-history.controller.js.map