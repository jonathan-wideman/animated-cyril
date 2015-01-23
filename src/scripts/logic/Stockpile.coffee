class exports.Stockpile
    constructor: (@game) ->
        # Resource naming constants
        @AER = 'Aeregium'
        @DYN = 'Dynamis'

        @resources = [
            { name: 'Aeregium', amount: 0 }
            { name: 'Dynamis', amount: 0 }
        ]

    getStatusText: ()->
        status = ''
        status += resource.name + ': ' + resource.amount + '\n' for resource in @resources
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
