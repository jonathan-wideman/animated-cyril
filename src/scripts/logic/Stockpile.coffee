class exports.Stockpile
    constructor: (@game) ->
        # Resource naming constants
        @AER = 'Aeregium'
        @DYN = 'Dynamis'

        @resources = [
            { name: 'Aeregium', amount: 0, maximum: 0 }
            { name: 'Dynamis', amount: 0, maximum: 0 }
        ]

    getStatusText: ()->
        status = ''
        status += resource.name + ': ' + resource.amount + '/' + resource.maximum + '\n' for resource in @resources
        return status

    find: (resource)->
        return _.find(@resources, { name: resource })

    earn: (resource, amount)->
        stock = @find(resource)
        if not stock
            # we don't have this resource, add an entry to the stockpile
            stock = { name: resource, amount: 0  }
            @resources.push(stock)
        # add some of this resource to our stocks
        stock.amount += amount
        # if the stock exceeds the maximum, reduce it
        stock.amount = Phaser.Math.clamp(stock.amount, 0, stock.maximum)

    canAfford: (resource, amount)->
        stock = @find(resource)
        if not stock
            # we don't have this resource at all
            return false
        # we have this resource, return if we have enough
        return stock.amount >= amount

    spend: (resource, amount)->
        if not @canAfford(resource, amount)
            # we can't afford this - return false
            return false
        # we are able to afford this - spend it
        stock = @find(resource)
        stock.amount -= amount
        # we spent the resource - return true
        return true

    increaseMax: (resource, amount)->
        stock = @find(resource)
        if not stock
            # we don't have this resource at all
            stock = { name: resource, amount: 0, maximum: 0 }
            @resources.push(stock)
        # increase the maximum for this resource
        stock.maximum += amount

    decreaseMax: (resource, amount)->
        stock = @find(resource)
        if not stock
            # we don't have this resource at all
            return
        # decrease the maximum for this resource
        stock.maximum -= amount
        # ensure we don't go below zero
        stock.maximum = Phaser.Math.clampBottom(stock.maximum, 0)
        # if the stock exceeds the new maximum, reduce it
        stock.amount = Phaser.Math.clamp(stock.amount, 0, stock.maximum)
