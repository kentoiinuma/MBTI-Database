# frozen_string_literal: true

require_relative 'base_edge'
require_relative 'base_connection'

module Types
  class BaseObject < GraphQL::Schema::Object
    edge_type_class(Types::BaseEdge)
    connection_type_class(Types::BaseConnection)
    field_class Types::BaseField
  end
end