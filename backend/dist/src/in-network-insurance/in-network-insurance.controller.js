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
exports.InNetworkInsuranceController = void 0;
const common_1 = require("@nestjs/common");
const in_network_insurance_service_1 = require("./in-network-insurance.service");
const createInNetworkInsuranceDTO_1 = require("./DTOS/createInNetworkInsuranceDTO");
const updateInNetworkInsuranceDTO_1 = require("./DTOS/updateInNetworkInsuranceDTO");
let InNetworkInsuranceController = class InNetworkInsuranceController {
    inNetworkInsuranceService;
    constructor(inNetworkInsuranceService) {
        this.inNetworkInsuranceService = inNetworkInsuranceService;
    }
    findAll() {
        return this.inNetworkInsuranceService.findAll();
    }
    findOne(id) {
        return this.inNetworkInsuranceService.findOne(id);
    }
    create(dto) {
        return this.inNetworkInsuranceService.create(dto);
    }
    update(id, dto) {
        return this.inNetworkInsuranceService.update(id, dto);
    }
    remove(id) {
        return this.inNetworkInsuranceService.remove(id);
    }
};
exports.InNetworkInsuranceController = InNetworkInsuranceController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InNetworkInsuranceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InNetworkInsuranceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createInNetworkInsuranceDTO_1.CreateInNetworkInsuranceDto]),
    __metadata("design:returntype", void 0)
], InNetworkInsuranceController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateInNetworkInsuranceDTO_1.UpdateInNetworkInsuranceDto]),
    __metadata("design:returntype", void 0)
], InNetworkInsuranceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InNetworkInsuranceController.prototype, "remove", null);
exports.InNetworkInsuranceController = InNetworkInsuranceController = __decorate([
    (0, common_1.Controller)('in-network-insurance'),
    __metadata("design:paramtypes", [in_network_insurance_service_1.InNetworkInsuranceService])
], InNetworkInsuranceController);
//# sourceMappingURL=in-network-insurance.controller.js.map