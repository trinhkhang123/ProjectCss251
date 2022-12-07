pragma circom 2.1.0;
template QQ () {
    signal input a;
    signal input b;
    signal output c;
    c <== a + b;
     signal dummy;
    dummy <== a * b;
    //f === 33;
}


component main {public [a,b]} = QQ();