import { Body, Controller, Delete, FileTypeValidator, Get, HttpException, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileHandlingService } from "src/common/services/file-handling.service";
import { ValidateObjectIdPipe } from "src/common/validations/validate-object-id.pipe";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private fileHandlingService: FileHandlingService
    ) {}

    @UseInterceptors(FileInterceptor('avatar'))
    @Post()
    async create(
        @Body() createUserDto: CreateUserDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
                    new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }),
                ],
                fileIsRequired: false,
                exceptionFactory: (errors) => new HttpException('Logo must be PNG/JPG/JPEG under 1MB', 400),
            }),
        ) avatar: Express.Multer.File
    ) {
        const user = await this.userService.create(createUserDto);

        if(avatar) {
            const key = `inventory/user/${user._id}`;
            const fileUrl = await this.fileHandlingService.uploadFile(avatar, key);
            return await this.userService.updateAvatar(user._id, fileUrl);
        } else {
            return user;
        }
    }

    @Get(':id')
    findOne(@Param('id') id: ValidateObjectIdPipe) {
        return this.userService.findOne(id);
    }

    @UseInterceptors(FileInterceptor('avatar'))
    @Patch(':id')
    async update(
        @Param('id') id: ValidateObjectIdPipe,
        @Body() updateUserDto: UpdateUserDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
                    new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }),
                ],
                fileIsRequired: false,
                exceptionFactory: (errors) => new HttpException('Logo must be PNG/JPG/JPEG under 1MB', 400),
            }),
        ) avatar: Express.Multer.File
    ) {
        const findUser = await this.userService.findOne(id);
        if(!findUser) throw new HttpException('User not Found!', 400);

        if(avatar) {
            if(findUser.avatar && findUser.avatar != '') this.fileHandlingService.deleteFile(findUser.avatar);
            
            const key = `inventory/user/${id.toString()}`;
            const fileUrl = await this.fileHandlingService.uploadFile(avatar, key);
            const updateData = {...updateUserDto, avatar: fileUrl}
            return this.userService.update(id, updateData);
        } else {
            if(findUser.avatar && findUser.avatar != '') {
                const updateData = {...updateUserDto, avatar: findUser.avatar}
                const updatedUser = this.userService.update(id, updateData);
                return updatedUser;
            } else {
                const updatedUser = this.userService.update(id, updateUserDto);
                return updatedUser;
            }
        }   
    }

    @Delete(':id')
    async remove(@Param('id') id: ValidateObjectIdPipe) {
        /*
            All Other Delete Actions will be placed here!
        */
        const deletedUser = await this.userService.remove(id);
        if(!deletedUser) throw new HttpException('User Not Found!', 400);
        return deletedUser;
    }
}