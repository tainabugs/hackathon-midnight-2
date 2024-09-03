'use strict';
const __compactRuntime = require('@midnight-ntwrk/compact-runtime');
const expectedRuntimeVersionString = '0.6.13';
const expectedRuntimeVersion = expectedRuntimeVersionString.split('-')[0].split('.').map(Number);
const actualRuntimeVersion = __compactRuntime.versionString.split('-')[0].split('.').map(Number);
if (expectedRuntimeVersion[0] != actualRuntimeVersion[0]
     || (actualRuntimeVersion[0] == 0 && expectedRuntimeVersion[1] != actualRuntimeVersion[1])
     || expectedRuntimeVersion[1] > actualRuntimeVersion[1]
     || (expectedRuntimeVersion[1] == actualRuntimeVersion[1] && expectedRuntimeVersion[2] > actualRuntimeVersion[2]))
   throw new __compactRuntime.CompactError(`Version mismatch: compiled code expects ${expectedRuntimeVersionString}, runtime is ${__compactRuntime.versionString}`);
{ const MAX_FIELD = 52435875175126190479447740508185965837690552500527637822603658699938581184512n;
  if (__compactRuntime.MAX_FIELD !== MAX_FIELD)
     throw new __compactRuntime.CompactError(`compiler thinks maximum field value is ${MAX_FIELD}; run time thinks it is ${__compactRuntime.MAX_FIELD}`)
}

var STATE;
(function (STATE) {
  STATE[STATE['vacant'] = 0] = 'vacant';
  STATE[STATE['occupied'] = 1] = 'occupied';
})(STATE = exports.STATE || (exports.STATE = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeBoolean();

const _descriptor_2 = new __compactRuntime.CompactTypeOpaqueString();

class _Maybe_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_2.alignment());
  }
  fromValue(value) {
    return {
      is_some: _descriptor_1.fromValue(value),
      value: _descriptor_2.fromValue(value)
    }
  }
  toValue(value) {
    return _descriptor_1.toValue(value.is_some).concat(_descriptor_2.toValue(value.value));
  }
  valueAlignment(value) {
    return _descriptor_1.valueAlignment(value.is_some).concat(_descriptor_2.valueAlignment(value.value));
  }
}

const _descriptor_3 = new _Maybe_0();

const _descriptor_4 = new __compactRuntime.CompactTypeEnum(1, 1);

const _descriptor_5 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_6 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

const _descriptor_7 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

class Contract {
  witnesses;
  constructor(...args) {
    if (args.length !== 1)
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args.length}`);
    const witnesses = args[0];
    if (typeof(witnesses) !== 'object')
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    if (typeof(witnesses.local_secret_key) !== 'function')
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named local_secret_key');
    this.witnesses = witnesses;
    this.circuits = {
      post: (...args_0) => {
        if (args_0.length !== 2)
          throw new __compactRuntime.CompactError(`post: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
        const contextOrig = args_0[0];
        const message = args_0[1];
        if (!(typeof(contextOrig) === 'object' && contextOrig.originalState != undefined && contextOrig.transactionContext != undefined))
          __compactRuntime.type_error('post',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/bboard.compact line 21, char 1',
                                      'CircuitContext',
                                      contextOrig)
        const context = { ...contextOrig };
        const partialProofData = {
          input: {
            value: _descriptor_2.toValue(message),
            alignment: _descriptor_2.valueAlignment(message)
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result = this.#_post_0(context, partialProofData, message);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result, context: context, proofData: partialProofData };
      },
      take_down: (...args_0) => {
        if (args_0.length !== 1)
          throw new __compactRuntime.CompactError(`take_down: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
        const contextOrig = args_0[0];
        if (!(typeof(contextOrig) === 'object' && contextOrig.originalState != undefined && contextOrig.transactionContext != undefined))
          __compactRuntime.type_error('take_down',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/bboard.compact line 29, char 1',
                                      'CircuitContext',
                                      contextOrig)
        const context = { ...contextOrig };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result = this.#_take_down_0(context, partialProofData);
        partialProofData.output = { value: _descriptor_2.toValue(result), alignment: _descriptor_2.valueAlignment(result) };
        return { result: result, context: context, proofData: partialProofData };
      },
      public_key: (...args_0) => {
        if (args_0.length !== 3)
          throw new __compactRuntime.CompactError(`public_key: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
        const contextOrig = args_0[0];
        const sk = args_0[1];
        const instance = args_0[2];
        if (!(typeof(contextOrig) === 'object' && contextOrig.originalState != undefined && contextOrig.transactionContext != undefined))
          __compactRuntime.type_error('public_key',
                                      'argument 1 (as invoked from Typescript)',
                                      'src/bboard.compact line 41, char 1',
                                      'CircuitContext',
                                      contextOrig)
        if (!(sk.buffer instanceof ArrayBuffer && sk.BYTES_PER_ELEMENT === 1 && sk.length === 32))
          __compactRuntime.type_error('public_key',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'src/bboard.compact line 41, char 1',
                                      'Bytes[32]',
                                      sk)
        if (!(instance.buffer instanceof ArrayBuffer && instance.BYTES_PER_ELEMENT === 1 && instance.length === 32))
          __compactRuntime.type_error('public_key',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'src/bboard.compact line 41, char 1',
                                      'Bytes[32]',
                                      instance)
        const context = { ...contextOrig };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(sk).concat(_descriptor_0.toValue(instance)),
            alignment: _descriptor_0.valueAlignment(sk).concat(_descriptor_0.valueAlignment(instance))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result = this.#_public_key_0(context,
                                           partialProofData,
                                           sk,
                                           instance);
        partialProofData.output = { value: _descriptor_0.toValue(result), alignment: _descriptor_0.valueAlignment(result) };
        return { result: result, context: context, proofData: partialProofData };
      }
    };
    this.impureCircuits = {
      post: this.circuits.post,
      take_down: this.circuits.take_down
    };
  }
  initialState(...args) {
    if (args.length !== 2)
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 2 arguments (as invoked from Typescript), received ${args.length}`);
    const privateState = args[0];
    const title = args[1];
    const state = new __compactRuntime.ContractState();
    let stateValue = __compactRuntime.StateValue.newArray();
    stateValue = stateValue.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue = stateValue.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue = stateValue.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue = stateValue.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue = stateValue.arrayPush(__compactRuntime.StateValue.newNull());
    state.data = stateValue;
    state.setOperation('post', new __compactRuntime.ContractOperation());
    state.setOperation('take_down', new __compactRuntime.ContractOperation());
    const context = {
      originalState: state,
      currentPrivateState: privateState,
      transactionContext: new __compactRuntime.QueryContext(state.data, __compactRuntime.dummyContractAddress())
    };
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                            alignment: _descriptor_7.valueAlignment(0n) }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0),
                                                                            alignment: _descriptor_4.valueAlignment(0) }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ])
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(1n),
                                                                            alignment: _descriptor_7.valueAlignment(1n) }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(''),
                                                                            alignment: _descriptor_2.valueAlignment('') }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ])
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(2n),
                                                                            alignment: _descriptor_7.valueAlignment(2n) }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue({ is_some: false, value: '' }),
                                                                            alignment: _descriptor_3.valueAlignment({ is_some: false, value: '' }) }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ])
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(3n),
                                                                            alignment: _descriptor_7.valueAlignment(3n) }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(0n),
                                                                            alignment: _descriptor_5.valueAlignment(0n) }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ])
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(4n),
                                                                            alignment: _descriptor_7.valueAlignment(4n) }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                            alignment: _descriptor_0.valueAlignment(new Uint8Array(32)) }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ])
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                            alignment: _descriptor_7.valueAlignment(0n) }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0),
                                                                            alignment: _descriptor_4.valueAlignment(0) }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(1n),
                                                                            alignment: _descriptor_7.valueAlignment(1n) }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(title),
                                                                            alignment: _descriptor_2.valueAlignment(title) }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ]);
    const tmp = this.#_none_0(context, partialProofData);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(2n),
                                                                            alignment: _descriptor_7.valueAlignment(2n) }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp),
                                                                            alignment: _descriptor_3.valueAlignment(tmp) }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ]);
    const tmp_0 = 1n;
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_7.toValue(3n),
                                                alignment: _descriptor_7.valueAlignment(3n) } }
                                    ] } },
                     { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                            { value: _descriptor_6.toValue(tmp_0),
                                              alignment: _descriptor_6.valueAlignment(tmp_0) }
                                              .value
                                          )) } },
                     { ins: { cached: true, n: 1 } }
                    ]);
    state.data = context.transactionContext.state;
    return [context.currentPrivateState, state];
  }
  #_some_0(context, partialProofData, value) {
    return { is_some: true, value: value };
  }
  #_none_0(context, partialProofData) { return { is_some: false, value: '' }; }
  #_persistent_hash_0(context, partialProofData, x, y) {
    return __compactRuntime.persistentHash(x, y);
  }
  #_local_secret_key_0(context, partialProofData) {
    const contextRef = { context: context.transactionContext };
    const witnessContext = __compactRuntime.witnessContext(ledger, context.currentPrivateState, contextRef);
    const [nextPrivateState, result] = this.witnesses.local_secret_key(witnessContext);
    context.currentPrivateState = nextPrivateState;
    context.transactionContext = contextRef.context;
    if (!(result.buffer instanceof ArrayBuffer && result.BYTES_PER_ELEMENT === 1 && result.length === 32))
      __compactRuntime.type_error('local_secret_key',
                                  'return value',
                                  'src/bboard.compact line 19, char 1',
                                  'Bytes[32]',
                                  result)
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result),
      alignment: _descriptor_0.valueAlignment(result)
    });
    return result;
  }
  #_post_0(context, partialProofData, message) {
    __compactRuntime.assert(_descriptor_4.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_7.toValue(0n),
                                                                                                alignment: _descriptor_7.valueAlignment(0n) } }
                                                                                    ] } },
                                                                     { popeq: { cached: false,
                                                                                result: undefined } }
                                                                    ]).value)
                            ===
                            0,
                            'Attempted to post to an occupied board');
    const tmp = this.#_public_key_0(context,
                                    partialProofData,
                                    this.#_local_secret_key_0(context,
                                                              partialProofData),
                                    __compactRuntime.convert_bigint_to_Uint8Array(32,
                                                                                  _descriptor_5.fromValue(Contract._query(context,
                                                                                                                          partialProofData,
                                                                                                                          [
                                                                                                                           { dup: { n: 0 } },
                                                                                                                           { idx: { cached: false,
                                                                                                                                    pushPath: false,
                                                                                                                                    path: [
                                                                                                                                           { tag: 'value',
                                                                                                                                             value: { value: _descriptor_7.toValue(3n),
                                                                                                                                                      alignment: _descriptor_7.valueAlignment(3n) } }
                                                                                                                                          ] } },
                                                                                                                           { popeq: { cached: true,
                                                                                                                                      result: undefined } }
                                                                                                                          ]).value)));
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(4n),
                                                                            alignment: _descriptor_7.valueAlignment(4n) }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp),
                                                                            alignment: _descriptor_0.valueAlignment(tmp) }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ]);
    const tmp_0 = this.#_some_0(context, partialProofData, message);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(2n),
                                                                            alignment: _descriptor_7.valueAlignment(2n) }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_0),
                                                                            alignment: _descriptor_3.valueAlignment(tmp_0) }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                            alignment: _descriptor_7.valueAlignment(0n) }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(1),
                                                                            alignment: _descriptor_4.valueAlignment(1) }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ]);
  }
  #_take_down_0(context, partialProofData) {
    __compactRuntime.assert(_descriptor_4.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_7.toValue(0n),
                                                                                                alignment: _descriptor_7.valueAlignment(0n) } }
                                                                                    ] } },
                                                                     { popeq: { cached: false,
                                                                                result: undefined } }
                                                                    ]).value)
                            ===
                            1,
                            'Attempted to take down post from an empty board');
    __compactRuntime.assert(this.#_equal_0(_descriptor_0.fromValue(Contract._query(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_7.toValue(4n),
                                                                                                               alignment: _descriptor_7.valueAlignment(4n) } }
                                                                                                   ] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }
                                                                                   ]).value),
                                           this.#_public_key_0(context,
                                                               partialProofData,
                                                               this.#_local_secret_key_0(context,
                                                                                         partialProofData),
                                                               __compactRuntime.convert_bigint_to_Uint8Array(32,
                                                                                                             _descriptor_5.fromValue(Contract._query(context,
                                                                                                                                                     partialProofData,
                                                                                                                                                     [
                                                                                                                                                      { dup: { n: 0 } },
                                                                                                                                                      { idx: { cached: false,
                                                                                                                                                               pushPath: false,
                                                                                                                                                               path: [
                                                                                                                                                                      { tag: 'value',
                                                                                                                                                                        value: { value: _descriptor_7.toValue(3n),
                                                                                                                                                                                 alignment: _descriptor_7.valueAlignment(3n) } }
                                                                                                                                                                     ] } },
                                                                                                                                                      { popeq: { cached: true,
                                                                                                                                                                 result: undefined } }
                                                                                                                                                     ]).value)))),
                            'Attempted to take down post, but not the current poster');
    const former_msg = _descriptor_3.fromValue(Contract._query(context,
                                                               partialProofData,
                                                               [
                                                                { dup: { n: 0 } },
                                                                { idx: { cached: false,
                                                                         pushPath: false,
                                                                         path: [
                                                                                { tag: 'value',
                                                                                  value: { value: _descriptor_7.toValue(2n),
                                                                                           alignment: _descriptor_7.valueAlignment(2n) } }
                                                                               ] } },
                                                                { popeq: { cached: false,
                                                                           result: undefined } }
                                                               ]).value).value;
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                            alignment: _descriptor_7.valueAlignment(0n) }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0),
                                                                            alignment: _descriptor_4.valueAlignment(0) }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ]);
    const tmp = 1n;
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_7.toValue(3n),
                                                alignment: _descriptor_7.valueAlignment(3n) } }
                                    ] } },
                     { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                            { value: _descriptor_6.toValue(tmp),
                                              alignment: _descriptor_6.valueAlignment(tmp) }
                                              .value
                                          )) } },
                     { ins: { cached: true, n: 1 } }
                    ]);
    const tmp_0 = this.#_none_0(context, partialProofData);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(2n),
                                                                            alignment: _descriptor_7.valueAlignment(2n) }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_0),
                                                                            alignment: _descriptor_3.valueAlignment(tmp_0) }).encode() } },
                     { ins: { cached: false, n: 1 } }
                    ]);
    return former_msg;
  }
  #_public_key_0(context, partialProofData, sk, instance) {
    return this.#_persistent_hash_0(context,
                                    partialProofData,
                                    this.#_persistent_hash_0(context,
                                                             partialProofData,
                                                             new Uint8Array([98, 98, 111, 97, 114, 100, 58, 112, 107, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                             instance),
                                    sk);
  }
  #_equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) return false;
    return true;
  }
  static _query(context, partialProofData, prog) {
    var res;
    try {
      res = context.transactionContext.query(prog);
    } catch (err) {
      throw new __compactRuntime.CompactError(err.toString());
    }
    context.transactionContext = res.context;
    var reads = res.events.filter((e) => e.tag === 'read');
    var i = 0;
    partialProofData.publicTranscript = partialProofData.publicTranscript.concat(prog.map((op) => {
      if(typeof(op) === 'object' && 'popeq' in op) {
        return { popeq: {
          ...op.popeq,
          result: reads[i++].content,
        } };
      } else {
        return op;
      }
    }));
    if(res.events.length == 1 && res.events[0].tag === 'read') {
      return res.events[0].content;
    } else {
      return res.events;
    }
  }
}
function ledger(state) {
  const context = {
    originalState: state,
    transactionContext: new __compactRuntime.QueryContext(state, __compactRuntime.dummyContractAddress())
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get state() {
      return _descriptor_4.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_7.toValue(0n),
                                                                                 alignment: _descriptor_7.valueAlignment(0n) } }
                                                                     ] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }
                                                     ]).value);
    },
    get title() {
      return _descriptor_2.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_7.toValue(1n),
                                                                                 alignment: _descriptor_7.valueAlignment(1n) } }
                                                                     ] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }
                                                     ]).value);
    },
    get message() {
      return _descriptor_3.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_7.toValue(2n),
                                                                                 alignment: _descriptor_7.valueAlignment(2n) } }
                                                                     ] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }
                                                     ]).value);
    },
    get instance() {
      return _descriptor_5.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_7.toValue(3n),
                                                                                 alignment: _descriptor_7.valueAlignment(3n) } }
                                                                     ] } },
                                                      { popeq: { cached: true,
                                                                 result: undefined } }
                                                     ]).value);
    },
    get poster() {
      return _descriptor_0.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_7.toValue(4n),
                                                                                 alignment: _descriptor_7.valueAlignment(4n) } }
                                                                     ] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }
                                                     ]).value);
    }
  };
}
const _emptyContext = {
  originalState: new __compactRuntime.ContractState(),
  transactionContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  local_secret_key: (...args) => undefined
});
const pureCircuits = {
  public_key: (...args) => _dummyContract.circuits.public_key(_emptyContext, ...args).result
};
exports.Contract = Contract;
exports.ledger = ledger;
exports.pureCircuits = pureCircuits;
//# sourceMappingURL=index.cjs.map
