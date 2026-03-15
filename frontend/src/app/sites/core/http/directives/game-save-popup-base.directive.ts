import {Directive, output} from '@angular/core';
import {WithFile} from "../../../../main/core/dto/WithFile";
import {ResultStateBase} from "../dto/result/ResultStateBase";

@Directive()
export abstract class GameSavePopupBase<T extends ResultStateBase> {
  abstract openPopup(): void;

  public saveSessionEvent = output<WithFile<T>>();
}
