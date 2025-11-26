import { Body, Controller, FileTypeValidator, HttpException, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileHandlingService } from "src/common/services/file-handling.service";

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private fileHandlingService: FileHandlingService
    ) {}

    @UseInterceptors(FileInterceptor('avatar'))
    @Post()
    async createUser(
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
        const user = await this.userService.createUser(createUserDto);

        if(avatar) {
            const key = `inventory/user/${user._id}`;
            const fileUrl = await this.fileHandlingService.uploadFile(avatar, key);
            return this.userService.updateAvatar(user._id, fileUrl);
        } else {
            return user;
        }
    }
}