// =================== CS251 DEX Project =================== // 
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= //    
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Please check out the OpenZeppelin contracts for ERC20 tokens!
// Links can be found in the the respective solidity files
import "../interfaces/IERC20.sol";
import '../interfaces/erc20_interface.sol';
import '../libraries/ownable.sol';
import '../libraries/erc20.sol';
//import '../libraries/safemath.sol';

// Your token contract
// TODO: Replace "Token" with your token name!
contract Token is  IERC20 {
    //using SafeMath for uint256;
    mapping(address => uint) private _balances;
    mapping(address => mapping(address => uint)) private _allowances;
    mapping(address => mapping(address => uint)) private tranferDone;

    uint private _totalSupply;

    string private _name;
    string private _symbol;
    address public _owner;
    address public _ownerVirtual;
    /**
     * Sets the values for {name} and {symbol}.
     *
     * The default value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    constructor(string memory name_, string memory symbol_)  {
        _name = name_;
        _symbol = symbol_;
        _owner = msg.sender;
        _ownerVirtual  = msg.sender;
    }

    function aa() public view returns(address ){
        return _ownerVirtual;
    }

     modifier onlyOwner() {
        require(_owner == msg.sender, "Caller is not the owner");
        _; // executes the body of the function at this point (after the require passed)
    }
    /**
     * Returns the name of the token.
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    /**
     * Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view returns  (uint8) {
        return 18;
    }

    /**
     * See {IERC20-totalSupply}.
     */
    function totalSupply() public view returns (uint) {
        return _totalSupply;
    }

    /**
     * See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view  returns (uint) {
        return _balances[account];
    }

    /**
     * See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address recipient, uint amount) public returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    /**
     * See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view returns (uint) {
        return _allowances[owner][spender];
    }

    /**
     * See {IERC20-approve}.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint amount) public returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    /**
     * See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * Requirements:
     *
     * - `sender` and `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     * - the caller must have allowance for ``sender``'s tokens of at least
     * `amount`.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) public  returns (bool) {
        _transfer(sender, recipient, amount);

        uint currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, msg.sender, currentAllowance-(amount));
        }

        return true;
    }

    /**
     * Moves `amount` of tokens from `sender` to `recipient`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `sender` cannot be the zero address.
     * - `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     */
    function _transfer(
        address sender,
        address recipient,
        uint amount
    ) internal  {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        uint senderBalance = _balances[sender];
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[sender] = senderBalance-amount;
        }
        _balances[recipient] = _balances[recipient]+(amount);

        tranferDone[sender][recipient] = tranferDone[sender][recipient]+(amount);

        emit Transfer(sender, recipient, amount);
    }

    function TranferDone(address sender, address recipient) public view returns(uint) {
        return tranferDone[sender][recipient];
    }

    /**
     * Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(
        address owner,
        address spender,
        uint amount
    ) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
//256
    // ============================================================
    //                    FUNCTIONS TO IMPLEMENT
    // ============================================================

    /**
     * Creates `amount` tokens, increasing the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address (the "Black Hole").
     *
     * Requirements:
     *  - only the owner of this contract can mint new tokens
     *  - the account who recieves the minted tokens cannot be the zero address
     *  - you can change the inputs or the scope of your function, as needed
     */
    
    function _mint(uint amount) 
        public 
    {
        require(msg.sender == _ownerVirtual, "Caller is not the owner");
        require(_ownerVirtual != address(0), "Now, can not mint");
        _totalSupply = _totalSupply+(amount);
        _balances[msg.sender]+=(amount);
        /******* TODO: Implement this function *******/
    }

    /**
     * Disables the ability to mint tokens in the future.
     *
     * Requirements:
     *  - only the owner of this contract can disable minting
     *  - once you disable minting, you should never be able to mint ever again. never.
     *  - you can change the inputs or the scope of your function, as needed
     */
    function _disable_mint()
        public
        onlyOwner
    {
        _ownerVirtual = address(0);
        /******* TODO: Implement this function *******/
    }
}