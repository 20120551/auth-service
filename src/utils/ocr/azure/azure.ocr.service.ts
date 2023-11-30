import { Inject, Injectable } from '@nestjs/common';
import { AzureModuleOptions } from '.';
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from '@azure/ai-form-recognizer';

export const IAzureOcrService = 'IAzureOcrService';
export interface IAzureOcrService {
  poll<T extends object>(buffer: Buffer): Promise<T>;
}

@Injectable()
export class AzureOcrService implements IAzureOcrService {
  private readonly _client: DocumentAnalysisClient;
  constructor(
    @Inject(AzureModuleOptions)
    private _options: AzureModuleOptions,
  ) {
    this._client = new DocumentAnalysisClient(
      _options.endpoint,
      new AzureKeyCredential(_options.key),
    );
  }

  async poll<T extends object>(buffer: Buffer): Promise<T> {
    const poller = await this._client.beginAnalyzeDocument(
      this._options.ocrModel,
      buffer,
    );
    const data = await poller.pollUntilDone();
    const { documents } = data;
    const extractedFields = documents[0].fields;

    const result = {};
    for (const key in extractedFields) {
      if (extractedFields.hasOwnProperty(key)) {
        result[key] = extractedFields[key].content;
      }
    }
    return result as T;
  }
}
