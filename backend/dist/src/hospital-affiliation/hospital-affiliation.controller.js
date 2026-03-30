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
exports.HospitalAffiliationController = void 0;
const common_1 = require("@nestjs/common");
const hospital_affiliation_service_1 = require("./hospital-affiliation.service");
const createHospitalAffiliationDTO_1 = require("./DTOS/createHospitalAffiliationDTO");
const updateHospitalAffiliationDTO_1 = require("./DTOS/updateHospitalAffiliationDTO");
let HospitalAffiliationController = class HospitalAffiliationController {
    hospitalAffiliationService;
    constructor(hospitalAffiliationService) {
        this.hospitalAffiliationService = hospitalAffiliationService;
    }
    findAll() {
        return this.hospitalAffiliationService.findAll();
    }
    findOne(id) {
        return this.hospitalAffiliationService.findOne(id);
    }
    create(dto) {
        return this.hospitalAffiliationService.create(dto);
    }
    update(id, dto) {
        return this.hospitalAffiliationService.update(id, dto);
    }
    remove(id) {
        return this.hospitalAffiliationService.remove(id);
    }
};
exports.HospitalAffiliationController = HospitalAffiliationController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HospitalAffiliationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HospitalAffiliationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createHospitalAffiliationDTO_1.CreateHospitalAffiliationDto]),
    __metadata("design:returntype", void 0)
], HospitalAffiliationController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateHospitalAffiliationDTO_1.UpdateHospitalAffiliationDto]),
    __metadata("design:returntype", void 0)
], HospitalAffiliationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseIntPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HospitalAffiliationController.prototype, "remove", null);
exports.HospitalAffiliationController = HospitalAffiliationController = __decorate([
    (0, common_1.Controller)('hospital-affiliation'),
    __metadata("design:paramtypes", [hospital_affiliation_service_1.HospitalAffiliationService])
], HospitalAffiliationController);
//# sourceMappingURL=hospital-affiliation.controller.js.map