/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 /**
  * Atualiza a reputacao de um fan na blockchain
  * @param {com.trubr.badfan.ReportFan} req A instancia do report
  */
  function reportFan(req){

    req.fan.reputation=req.fan.reputation+req.reputation;
    
    return getAssetRegistry('com.trubr.badfan.Fan')
    .then(function (assetRegistry) {        
        return assetRegistry.update(req.fan);
    }).then(function () {
        return getParticipantRegistry('com.trubr.badfan.User');
    }).then(function (participantRegistry) {        
        return participantRegistry.update(req.fan.reporter);
    }).then(function () {
        return getParticipantRegistry('com.trubr.badfan.User');
    })
    .then(function (participantRegistry) {        
        return participantRegistry.update(req.fan.reporter);
    }).then(function () {        
        var event = getFactory().newEvent('com.trubr.badfan', 'SucessEvent');
        event.eventName = req.fan.reporter.email+" reportou "+req.fan.fanId+" como "+req.reputation;
        event.fan = req.fan;
        event.reporter=req.reporter;
        event.reputation=req.reputation;
        emit(event);
    });  
      
  }