import { Injectable } from '@nestjs/common';
import { DepositService, Token, WithdrawService ,BatchJoinSplitService, SplitService, isAddressCompliant, DarkPool} from '@thesingularitynetwork/singularity-sdk';
import { DarkpoolContext } from '../common/context/darkpool.context';
import { DatabaseService } from '../common/db/database.service';
import { NoteBatchJoinSplitService } from 'src/common/noteBatchJoinSplit.service';
import { Note } from '@thesingularitynetwork/darkpool-v1-proof';

@Injectable()
export class BasicService {
  // Method to deposit funds
  async deposit(darkPoolContext: DarkpoolContext, asset: Token, amount: bigint) {
    const depositService = new DepositService(darkPoolContext.darkPool);
    const dbservice = DatabaseService.getInstance();
    const { context, outNotes } = await depositService.prepare(
      asset.address, amount, darkPoolContext.walletAddress, darkPoolContext.signature);

    const id = await dbservice.addNote(
      darkPoolContext.chainId, 
      darkPoolContext.publicKey, 
      darkPoolContext.walletAddress, 
      0, 
      outNotes[0].note,
      outNotes[0].rho, 
      outNotes[0].asset,
      outNotes[0].amount,
      3,
      '')
    await depositService.generateProof(context);
    const tx = await depositService.execute(context);
    await dbservice.updateNoteTransactionAndStatus(id, tx);
  }

  // Method to withdraw funds
  async withdraw(darkPoolContext: DarkpoolContext, asset: Token, amount: bigint, receiptAddress : string) {
    
    if (!isAddressCompliant(receiptAddress, darkPoolContext.darkPool)) {
      throw new Error("Receipt address is not compliant")
    }

    const withdrawService = new WithdrawService(darkPoolContext.darkPool);
    const dbservice = DatabaseService.getInstance();

    let notes = await dbservice.getNoteByAssetAndAmount(asset.address, amount, darkPoolContext.chainId);
    if (notes.length > 0) {
      const noteToWithdraw = {
        note: notes[0].noteCommitment,
        rho: notes[0].rho,
        asset: notes[0].asset,
        amount: notes[0].amount
      } as Note;

      const { context: withdrawContext } = await withdrawService.prepare(
        noteToWithdraw, receiptAddress, darkPoolContext.signature);
      await withdrawService.generateProof(withdrawContext);
      await withdrawService.executeAndWaitForResult(withdrawContext);
      return;
    } else {
      notes = await dbservice.getNoteByAsset(asset.address, darkPoolContext.chainId);

      if (notes[0].amount > amount) {
        const noteToSplit = {
          note: notes[0].noteCommitment,
          rho: notes[0].rho,
          asset: notes[0].asset,
          amount: amount
        } as Note;
  
        const splitservice = new SplitService(darkPoolContext.darkPool);
        const {context : splitContext, outNotes} = await splitservice.prepare(noteToSplit, amount, darkPoolContext.signature);
        const ids : number[] = []; 
        for(let j = 0; j < outNotes.length; j++) {
          ids[j] = await dbservice.addNote(
            darkPoolContext.chainId, 
            darkPoolContext.publicKey, 
            darkPoolContext.walletAddress, 
            0, 
            outNotes[j].note,
            outNotes[j].rho, 
            outNotes[j].asset,
            outNotes[j].amount,
            3,
            '');
        }        
        await splitservice.generateProof(splitContext);
        const tx = await splitservice.execute(splitContext);

        for (let j = 0; j < outNotes.length; j++) {
          await dbservice.updateNoteTransactionAndStatus(ids[j], tx);
        }
  
        const { context: withdrawContext } = await withdrawService.prepare(
          outNotes[0], receiptAddress, darkPoolContext.signature);
        await withdrawService.generateProof(withdrawContext);
        await withdrawService.executeAndWaitForResult(withdrawContext);
  
        return;

      } else{
        const noteBatchJoinSplitService = new NoteBatchJoinSplitService();
        
        const notesToProcess = notes.map(note => {
          return {
            note: note.noteCommitment,
            rho: note.rho,
            asset: note.asset,
            amount: note.amount
          } as Note;
        });

        const noteToWithdraw = await noteBatchJoinSplitService.notesJoinSplit(notesToProcess, darkPoolContext, amount);
        if (noteToWithdraw === null){
          throw new Error("Insufficient funds");
        }

        const { context: withdrawContext } = await withdrawService.prepare(
          noteToWithdraw, receiptAddress, darkPoolContext.signature);
        await withdrawService.generateProof(withdrawContext);
        await withdrawService.executeAndWaitForResult(withdrawContext);
        return;

      }
    }
  }
}