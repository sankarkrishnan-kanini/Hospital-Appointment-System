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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorDocumentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DoctorDocumentService = class DoctorDocumentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.doctorDocument.findMany();
    }
    findOne(id) {
        return this.prisma.doctorDocument.findUnique({
            where: { id }
        });
    }
    create(data) {
        return this.prisma.doctorDocument.create({
            data: {
                doctorId: data.doctorId,
                documentType: data.documentType,
                fileUrl: Buffer.from(data.fileUrl),
            }
        });
    }
    update(id, data) {
        return this.prisma.doctorDocument.update({
            where: { id },
            data: {
                ...(data.doctorId && { doctorId: data.doctorId }),
                ...(data.documentType && { documentType: data.documentType }),
                ...(data.fileUrl && { fileUrl: Buffer.from(data.fileUrl) }),
            }
        });
    }
    remove(id) {
        return this.prisma.doctorDocument.delete({
            where: { id }
        });
    }
};
exports.DoctorDocumentService = DoctorDocumentService;
exports.DoctorDocumentService = DoctorDocumentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DoctorDocumentService);
//# sourceMappingURL=doctor-document.service.js.map