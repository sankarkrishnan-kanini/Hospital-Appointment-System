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
exports.OfficeController = void 0;
const common_1 = require("@nestjs/common");
const office_service_1 = require("./office.service");
const createOfficeDTO_1 = require("./DTOS/createOfficeDTO");
const updateOfficeDTO_1 = require("./DTOS/updateOfficeDTO");
let OfficeController = class OfficeController {
    officeService;
    constructor(officeService) {
        this.officeService = officeService;
    }
    findAll() {
        return this.officeService.findAll();
    }
    findOne(id) {
        return this.officeService.findOne(id);
    }
    create(dto) {
        return this.officeService.create(dto);
    }
    update(id, dto) {
        return this.officeService.update(id, dto);
    }
    remove(id) {
        return this.officeService.remove(id);
    }
};
exports.OfficeController = OfficeController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OfficeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OfficeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createOfficeDTO_1.CreateOfficeDto]),
    __metadata("design:returntype", void 0)
], OfficeController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateOfficeDTO_1.UpdateOfficeDto]),
    __metadata("design:returntype", void 0)
], OfficeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OfficeController.prototype, "remove", null);
exports.OfficeController = OfficeController = __decorate([
    (0, common_1.Controller)('office'),
    __metadata("design:paramtypes", [office_service_1.OfficeService])
], OfficeController);
//# sourceMappingURL=office.controller.js.map