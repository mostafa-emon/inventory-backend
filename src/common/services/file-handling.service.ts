import { DeleteObjectCommand, PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FileHandlingService {
    private region: string;
    private bucket: string;
    private s3: S3Client;
    
    
    constructor(private configService: ConfigService) {

        this.region = this.configService.get<string>('AWS_S3_REGION') || '';
        this.bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME') || '';
        this.s3 = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || ''
            },
        });
    }
    
    async uploadFile(logo, key: string) {
        const input: PutObjectCommandInput = {
            Body: logo.buffer,
            Bucket: this.bucket,
            Key: key,
            ContentType: logo.mimetype,
            ACL: 'public-read',
        }

        try {
            const response: PutObjectCommandOutput = await this.s3.send(
                new PutObjectCommand(input),
            )
            if(response.$metadata.httpStatusCode === 200) {
                return key;
            }
            throw new Error('File upload failed!');
        } catch (err) {
            throw err;
        }
    }

    async deleteFile(key: string) {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key, // file path in S3
            });
            await this.s3.send(command);
        } catch (error) {
            throw error;
        }
    }
}