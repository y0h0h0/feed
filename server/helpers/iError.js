class iError extends Error {
    constructor(code = 'GENERIC', message = 'Something went wrong', status = 400 , ...params) {
        super(...params)
        this.code = code
        this.status = status
        this.message = message
        this.where = this.stack.split('\n')[1].trim();
        this.stack = null
        this.isError = true
    }
}

module.exports = iError
